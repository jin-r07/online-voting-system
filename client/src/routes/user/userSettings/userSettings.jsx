import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../../context/toast";
import Footer from "../../../components/user/footer/footer";
import { useNavigate } from "react-router-dom";
import { IoEyeOff, IoEye } from "react-icons/io5";
import * as Yup from "yup";
import { useFormik } from "formik";

const passwordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one digit")
        .matches(/[@$!%*?&]/, "Password must contain at least one special character")
        .required("New password is required"),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], "Passwords must match")
        .required("Confirm password is required"),
});

export default function UserSettings() {
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/get-loggedIn-user", { withCredentials: true });
                setEmail(response.data.user.email);
                setUser(response.data.user);
            } catch (err) {
                toast.error("Please log in with your account.");
            }
        };

        fetchUserEmail();
    }, [toast]);

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validationSchema: passwordValidationSchema,
        onSubmit: async (values) => {
            const { currentPassword, newPassword, confirmNewPassword } = values;
            if (newPassword !== confirmNewPassword) {
                toast.error("New passwords do not match.");
                return;
            }
            try {
                const response = await axios.put(
                    "http://localhost:8080/api-admin/forgot-password2",
                    { email, currentPassword, newPassword },
                    { withCredentials: true }
                );
                toast.success(response.data.message || "Password changed successfully!");
                formik.resetForm();
            } catch (err) {
                toast.error(err.response?.data?.error || "Error changing password.");
            }
        },
    });

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailUpdate = async () => {
        if (!user) {
            toast.error("User information is not available.");
            return;
        }
        try {
            await axios.put(`http://localhost:8080/api-admin/edit-user-email/${user._id}`, { email }, { withCredentials: true });
            toast.success("Email updated successfully!");
        } catch (err) {
            toast.error("Error updating email.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
        try {
            await axios.delete(`http://localhost:8080/api-admin/delete-user/${user._id}`, { withCredentials: true });
            toast.success("Account deleted successfully!");
            navigate("/");
            window.location.reload();
        } catch (err) {
            toast.error("Error deleting account.");
        }
    };

    return (
        <div className="w-full h-screen lg:mt-12 mt-8">
            <div className="w-full h-full lg:px-28 px-4">
                <h2 className="lg:text-3xl text-xl font-extrabold lg:mb-12 mb-8">User Settings</h2>
                <div className="space-y-6">
                    <div className="border-[1px] border-gray-300 p-4 rounded-md">
                        <h3 className="text-xl font-semibold mb-4">Edit Email</h3>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="border p-2 rounded-lg w-full lg:text-lg text-base"
                            placeholder="Enter your email"
                        />
                        <button
                            onClick={handleEmailUpdate}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
                        >
                            Update Email
                        </button>
                    </div>

                    <div className="border-[1px] border-gray-300 p-4 rounded-md">
                        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="relative mb-4">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    name="currentPassword"
                                    value={formik.values.currentPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="border p-2 rounded-lg w-full lg:text-lg text-base"
                                    placeholder="Current Password"
                                />
                                <span
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-2.5 cursor-pointer"
                                >
                                    {showCurrentPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                                </span>
                                {formik.touched.currentPassword && formik.errors.currentPassword && (
                                    <div className="text-red-600 text-sm">{formik.errors.currentPassword}</div>
                                )}
                            </div>

                            <div className="relative mb-4">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="border p-2 rounded-lg w-full lg:text-lg text-base"
                                    placeholder="New Password"
                                />
                                <span
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-2.5 cursor-pointer"
                                >
                                    {showNewPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                                </span>
                                {formik.touched.newPassword && formik.errors.newPassword && (
                                    <div className="text-red-600 text-sm">{formik.errors.newPassword}</div>
                                )}
                            </div>

                            <div className="relative mb-4">
                                <input
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    name="confirmNewPassword"
                                    value={formik.values.confirmNewPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="border p-2 rounded-lg w-full lg:text-lg text-base"
                                    placeholder="Confirm New Password"
                                />
                                <span
                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                    className="absolute right-3 top-2.5 cursor-pointer"
                                >
                                    {showConfirmNewPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                                </span>
                                {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && (
                                    <div className="text-red-600 text-sm">{formik.errors.confirmNewPassword}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
                            >
                                Change Password
                            </button>
                        </form>
                    </div>

                    <div className="border-[1px] border-gray-300 p-4 rounded-md">
                        <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
                        <p className="text-red-600 mb-2 lg:text-lg text-base">
                            Warning: Deleting your account is irreversible. Your account will be permanently lost.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
