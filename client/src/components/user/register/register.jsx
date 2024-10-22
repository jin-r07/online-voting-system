import React, { useState, useEffect } from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { useFormik } from "formik";
import * as Yup from "yup";
import { extractTextFromImage } from "../../../utils/ocr";
import { Oval } from "react-loader-spinner";
import { useToast } from "../../../context/toast";

export default function RegisterForm({ onClose, showLoginForm }) {
    const toast = useToast();

    const [selectedFile, setSelectedFile] = useState(null);

    const [extractedVoterId, setExtractedVoterId] = useState('');

    const [loading, setLoading] = useState(false);

    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        picture: Yup.mixed()
            .required("Voter Id Card picture is required"),
        voterIdCardNumber: Yup.string()
            .required("Voter Id Card No is required")
            .test("voter-id-match", "Numbers do not match", value => extractedVoterId !== "Not found" && (!extractedVoterId || value === extractedVoterId)),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters long")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/\d/, "Password must contain at least one digit")
            .matches(/[@$!%*?&]/, "Password must contain at least one special character"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords do not match")
            .required("Confirm Password is required")
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            voterIdCardNumber: "",
            password: "",
            confirmPassword: "",
            picture: null
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("voterIdCardNumber", values.voterIdCardNumber);
            formData.append("password", values.password);
            formData.append("confirmPassword", values.confirmPassword);
            formData.append("picture", values.picture);

            try {
                const response = await fetch("http://localhost:8080/api/register-new-user", {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 409) {
                        toast.error(result.message || "User with this email or Voter ID already exists.");
                    } else {
                        throw new Error(result.error || "Network response was not ok.");
                    }
                } else {
                    setShowSuccessPopup(true);
                }
            } catch (error) {
                if (error.message !== "Network response was not ok.") {
                    toast.error(error.message || "Something went wrong. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        if (extractedVoterId === "Not found") {
            formik.setFieldError("voterIdCardNumber", "Voter Id Card number not found in the uploaded image. Please check and try again.");
            formik.setFieldValue("voterIdCardNumber", "");
        } else if (extractedVoterId) {
            formik.setFieldValue("voterIdCardNumber", extractedVoterId);
            formik.setFieldError("voterIdCardNumber", "");
        } else {
            formik.setFieldValue("voterIdCardNumber", "");
        }
    }, [extractedVoterId]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!["image/png", "image/jpeg"].includes(file.type)) {
                toast.error("Invalid file type. Only PNG and JPEG are allowed.");
                setSelectedFile(null);
                await formik.setFieldValue("picture", null);
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size exceeds 5MB. Please upload a smaller file.");
                setSelectedFile(null);
                await formik.setFieldValue("picture", null);
                return;
            }

            setSelectedFile(URL.createObjectURL(file));
            await formik.setFieldValue("picture", file);
            setLoading(true);

            try {
                const extracted = await extractTextFromImage(file);
                const extractedValue = extracted || "Not found";
                setExtractedVoterId(extractedValue);
            } catch (error) {
                setExtractedVoterId("Not found");
            } finally {
                setLoading(false);
            }
        } else {
            setExtractedVoterId('');
            await formik.setFieldValue("voterIdCardNumber", "");
        }
    };

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-60 overflow-auto">
            <div className="relative p-6 rounded-lg w-full max-w-sm bg-white lg:mt-[6rem] mt-24 mb-8">
                <button onClick={onClose} className="absolute top-2 right-2 hover:bg-red-500 hover:text-white rounded-md">
                    <IoClose size={24} />
                </button>

                {loading && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-50">
                        <Oval
                            ariaLabel="loading-indicator"
                            height={60}
                            width={60}
                            strokeWidth={3}
                            color="#372FDF"
                            secondaryColor="#2563EB"
                        />
                    </div>
                )}

                <h2 className="text-xl mb-4">Create a new account to get started.</h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-base">Email:</label>
                        <input
                            type="email"
                            name="email"
                            className="mt-1 p-2 border rounded w-full"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={loading}
                            placeholder="Enter your email"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-base ml-1">{formik.errors.email}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block text-base font-medium">Upload Voter Id Card Picture:</label>
                        <p className="text-sm">(PNG/JPEG only, max 5MB)</p>
                        <div className="mt-2 relative">
                            <input
                                type="file"
                                name="picture"
                                accept="image/png, image/jpeg"
                                id="file-input"
                                className="hidden"
                                onChange={handleFileChange}
                                onBlur={formik.handleBlur}
                                disabled={loading}
                            />
                            <label
                                htmlFor="file-input"
                                className="block cursor-pointer border-2 border-gray-300 border-dashed rounded-lg py-4 px-4 text-center hover:bg-blue-50 hover:text-blue-700 transition duration-150"
                            >
                                {selectedFile ? (
                                    <div className="relative">
                                        <img src={selectedFile} alt="Preview"
                                            className="h-auto w-32 object-cover rounded border border-gray-300 mx-auto" />
                                        <div
                                            className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded shadow-md">
                                            Preview
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M19 9l-7 7-3-3-4 4V5h12v4l4 4z"></path>
                                        </svg>
                                        <p className="mt-2 text-sm">Click to upload your voter id card picture</p>
                                    </div>
                                )}
                            </label>
                            {formik.touched.picture && formik.errors.picture && (
                                <p className="text-red-500 text-base mt-1 ml-1">{formik.errors.picture}</p>
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-base">Voter Id Card Number:</label>
                        <input
                            type="text"
                            name="voterIdCardNumber"
                            className="mt-1 p-2 border rounded w-full"
                            value={loading ? 'Loading...' : formik.values.voterIdCardNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={loading}
                            placeholder="Enter Voter Id Card Number"
                        />
                        {formik.touched.voterIdCardNumber && formik.errors.voterIdCardNumber && (
                            <p className="text-red-500 text-base ml-1">{formik.errors.voterIdCardNumber}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-base">Password:</label>
                        <div className="relative">
                            <input
                                type={showRegisterPassword ? 'text' : 'password'}
                                name="password"
                                className="mt-1 p-2 border rounded w-full"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={loading}
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3"
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            >
                                {showRegisterPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-base ml-1">{formik.errors.password}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block text-base">Confirm Password:</label>
                        <div className="relative">
                            <input
                                type={showRegisterConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                className="mt-1 p-2 border rounded w-full"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={loading}
                                placeholder="Confirm password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3"
                                onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                            >
                                {showRegisterConfirmPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                            </button>
                        </div>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="text-red-500 text-base ml-1">{formik.errors.confirmPassword}</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-between">
                        <button type="submit"
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}>
                            {loading ? 'Loading...' : 'Register'}
                        </button>
                    </div>
                    <div className="flex flex-col mt-4 items-center">
                        <button type="button" onClick={showLoginForm} className="text-blue-500 hover:underline w-fit">
                            Already have an account? Log In
                        </button>
                    </div>
                </form>
            </div>

            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-xs text-center">
                        <h3 className="text-xl mb-2">Registration Successful!</h3>
                        <p className="text-base mb-4">Account has been successfully created.</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none transition duration-150" onClick={showLoginForm}>
                            Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}