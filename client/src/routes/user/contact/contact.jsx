import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Footer from "../../../components/user/footer/footer";
import axios from "axios";

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    message: Yup.string()
        .required("Message is required")
        .min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            message: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post("http://localhost:8080/api/send-contact-message", values);
                alert(response.data);
                resetForm();
            } catch (error) {
                alert("Error sending email: " + error.response.data);
            }
        },
    });

    return (
        <div className="w-full h-full flex flex-col justify-between bg-gray-50">
            <div className="flex-grow container mx-auto p-6">
                <h1 className="text-4xl font-bold text-center my-6 text-blue-600">Contact Us</h1>

                <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg border border-gray-200">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                        ) : null}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            name="message"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.message}
                            placeholder="Type your message here"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                            rows="5"
                        />
                        {formik.touched.message && formik.errors.message ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
                        ) : null}
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}
