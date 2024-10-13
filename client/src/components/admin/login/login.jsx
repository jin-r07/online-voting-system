import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            adminIdNumber: "",
            password: "",
        },
        validationSchema: Yup.object({
            adminIdNumber: Yup.string()
                .required("Admin ID number is required"),
            password: Yup.string()
                .required("Password is required")
        }),
        onSubmit: async (values) => {
            setLoading(true);

            try {
                const response = await fetch("http://localhost:8080/api-admin/login-admin", {
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
                        toast.error(result.message || "Invalid Admin ID number or password.", {
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
                    const data = await response.json();
                    console.log("Login successful:", data);
                    navigate("/admin-dashboard");
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
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
            <ToastContainer />
            <form onSubmit={formik.handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
                <div className="mb-4">
                    <label htmlFor="adminIdNumber" className="block text-sm font-medium text-gray-700">Admin ID Number</label>
                    <input
                        id="adminIdNumber"
                        name="adminIdNumber"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.adminIdNumber}
                        className={`mt-1 p-3 border rounded-md w-full transition duration-150 ease-in-out 
                                    ${formik.touched.adminIdNumber && formik.errors.adminIdNumber ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter Admin ID"
                    />
                    {formik.touched.adminIdNumber && formik.errors.adminIdNumber ? (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.adminIdNumber}</div>
                    ) : null}
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={`mt-1 p-3 border rounded-md w-full transition duration-150 ease-in-out 
                                    ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter Password"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                    ) : null}
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
