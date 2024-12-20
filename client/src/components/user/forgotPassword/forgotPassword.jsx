import React, { useState, useEffect } from "react";
import { IoClose, IoEyeOff, IoEye } from "react-icons/io5";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "../../../context/toast";

export default function ForgotPasswordForm({ onClose, showLoginForm }) {
    const toast = useToast();

    const [loading, setLoading] = useState(false);

    const [otpSent, setOtpSent] = useState(false);

    const [otpVerified, setOtpVerified] = useState(false);

    const [email, setEmail] = useState('');

    const [cooldown, setCooldown] = useState(0);

    const [otpExpires, setOtpExpires] = useState(false);

    const [showNewPassword, setShowNewPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => {
                setCooldown(cooldown - 1);
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [cooldown]);

    useEffect(() => {
        let otpTimer;
        if (otpSent) {
            otpTimer = setTimeout(() => {
                setOtpExpires(true);
                toast.error("OTP has expired. Please request a new one.");
            }, 300000);
        }

        return () => clearTimeout(otpTimer);
    }, [otpSent]);

    const emailValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
    });

    const otpValidationSchema = Yup.object().shape({
        otp: Yup.string()
            .length(6, "OTP must be 6 digits")
            .required("OTP is required"),
    });

    const passwordValidationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, "Password must be at least 8 characters long")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/\d/, "Password must contain at least one digit")
            .matches(/[@$!%*?&]/, "Password must contain at least one special character")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const formikEmail = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: emailValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setEmail(values.email);

            try {
                const response = await fetch("http://localhost:8080/api/send-otp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.message || "Failed to send OTP.");
                } else {
                    toast.success("OTP sent to your email.");
                    setOtpSent(true);
                    setCooldown(300);
                    setOtpExpires(false);
                }
            } catch (error) {
                toast.error(error.message || "Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        },
    });

    const formikOtp = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: otpValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            if (otpExpires) {
                toast.error("OTP has expired, please try again.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/verify-otp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, otp: values.otp }),
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.message || "Invalid OTP.");
                } else {
                    toast.success("OTP verified successfully.");
                    setOtpVerified(true);
                }
            } catch (error) {
                toast.error("Invalid OTP.");
            } finally {
                setLoading(false);
            }
        },
    });

    const formikPassword = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: passwordValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            try {
                const response = await fetch("http://localhost:8080/api-admin/forgot-password", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password: values.password }),
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.message || "Failed to change password.");
                } else {
                    toast.success("Password changed successfully.");
                    onClose();
                }
            } catch (error) {
                toast.error(error.message || "Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleResendOtp = async () => {
        if (cooldown === 0) {
            formikEmail.handleSubmit();
        }
    };

    const formatCooldown = () => {
        const minutes = Math.floor(cooldown / 60);
        const seconds = cooldown % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative p-6 rounded-lg w-full max-w-sm bg-white">
                <button onClick={onClose} className="absolute top-2 right-2 hover:bg-red-500 hover:text-white rounded-md" aria-label="Close">
                    <IoClose size={24} />
                </button>

                {otpVerified ? (
                    <>
                        <h2 className="text-xl mb-4">Change Password</h2>
                        <form onSubmit={formikPassword.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-base">New Password:</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="password"
                                        className="mt-1 p-2 border rounded w-full"
                                        value={formikPassword.values.password}
                                        onChange={formikPassword.handleChange}
                                        onBlur={formikPassword.handleBlur}
                                        disabled={formikPassword.isSubmitting}
                                        aria-label="New Password"
                                    />
                                    <span
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-3.5 cursor-pointer"
                                    >
                                        {showNewPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                                    </span>
                                </div>
                                {formikPassword.touched.password && formikPassword.errors.password && (
                                    <p className="text-red-500 text-base ml-1">{formikPassword.errors.password}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-base">Confirm Password:</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        className="mt-1 p-2 border rounded w-full"
                                        value={formikPassword.values.confirmPassword}
                                        onChange={formikPassword.handleChange}
                                        onBlur={formikPassword.handleBlur}
                                        disabled={formikPassword.isSubmitting}
                                        aria-label="Confirm Password"
                                    />
                                    <span
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3.5 cursor-pointer"
                                    >
                                        {showConfirmPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                                    </span>
                                </div>
                                {formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword && (
                                    <p className="text-red-500 text-base ml-1">{formikPassword.errors.confirmPassword}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className={`w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    disabled={loading}
                                    aria-label="Submit New Password"
                                >
                                    {loading ? "Loading..." : "Change Password"}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        {!otpSent ? (
                            <>
                                <h2 className="text-xl mb-4">Forgot Password</h2>
                                <p>Please enter your registered email address,</p>
                                <form onSubmit={formikEmail.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-base">Email:</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="mt-1 p-2 border rounded w-full"
                                            value={formikEmail.values.email}
                                            onChange={formikEmail.handleChange}
                                            onBlur={formikEmail.handleBlur}
                                            disabled={formikEmail.isSubmitting}
                                            aria-label="Email"
                                        />
                                        {formikEmail.touched.email && formikEmail.errors.email && (
                                            <p className="text-red-500 text-base ml-1">{formikEmail.errors.email}</p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <button
                                            type="submit"
                                            className={`w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                            disabled={loading}
                                            aria-label="Submit Email"
                                        >
                                            {loading ? "Sending OTP..." : "Send OTP"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl mb-4">Verify OTP</h2>
                                <form onSubmit={formikOtp.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-base">OTP:</label>
                                        <input
                                            type="text"
                                            name="otp"
                                            className="mt-1 p-2 border rounded w-full"
                                            value={formikOtp.values.otp}
                                            onChange={formikOtp.handleChange}
                                            onBlur={formikOtp.handleBlur}
                                            disabled={formikOtp.isSubmitting}
                                            aria-label="OTP"
                                        />
                                        {formikOtp.touched.otp && formikOtp.errors.otp && (
                                            <p className="text-red-500 text-base ml-1">{formikOtp.errors.otp}</p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <button
                                            type="submit"
                                            className={`w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                            disabled={loading}
                                            aria-label="Submit OTP"
                                        >
                                            {loading ? "Loading..." : "Verify OTP"}
                                        </button>
                                    </div>
                                    <div className="mb-4 text-center">
                                        <button
                                            type="button"
                                            className={`text-blue-600 hover:underline ${cooldown > 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                            onClick={handleResendOtp}
                                            disabled={cooldown > 0}
                                            aria-label="Resend OTP"
                                        >
                                            Resend OTP {cooldown > 0 && `(${formatCooldown()})`}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </>
                )}
                <div className="text-center mt-4">
                    <button
                        type="button"
                        className="text-blue-500 hover:underline"
                        onClick={showLoginForm}
                        aria-label="Back to Login"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
