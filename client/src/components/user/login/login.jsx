import React, { useState } from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onClose, showRegisterForm, showForgotPasswordForm }) {
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            try {
                const response = await fetch("http://localhost:8080/api/login-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                    credentials: "include",
                });

                if (!response.ok) {
                    const result = await response.json();
                    if (response.status === 401) {
                        toast.error(result.message || "Invalid email or password.", {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    } else {
                        throw new Error(result.error || "Network response was not ok.");
                    }
                } else {
                    navigate("/vote");
                    window.location.reload();
                    onClose();
                }
            } catch (error) {
                toast.error(error.message || "Something went wrong. Please try again later.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <ToastContainer limit={1} />
            <div className="relative p-6 rounded-lg w-full max-w-sm bg-white">
                <button onClick={onClose} className="absolute top-2 right-2 hover:bg-red-500 hover:text-white rounded-md">
                    <IoClose size={24} />
                </button>

                <h2 className="text-xl mb-4">Welcome back!<br />Please log in to continue.</h2>

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
                            disabled={formik.isSubmitting}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-base ml-1w">{formik.errors.email}</p>
                        )}
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-base">Password:</label>
                        <div className="relative">
                            <input
                                type={showLoginPassword ? 'text' : 'password'}
                                name="password"
                                className="mt-1 p-2 border rounded w-full pr-12"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                            >
                                {showLoginPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-base ml-1w">{formik.errors.password}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <button type="submit"
                            className={`w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={formik.isSubmitting}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                    <div className="flex flex-col mt-4 items-center">
                        <button type="button" onClick={showRegisterForm} className="text-blue-500 hover:underline w-fit">
                            Don't have an account? Register
                        </button>
                        <button type="button" onClick={showForgotPasswordForm} className="text-blue-500 hover:underline w-fit">
                            Forgot password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
