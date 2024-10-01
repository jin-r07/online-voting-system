import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PartyForm = ({ party, onPartyUpdated }) => {
    const [imagePreview, setImagePreview] = useState("");

    const [initialValues, setInitialValues] = useState({
        name: '',
        image: null,
    });

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        image: Yup.mixed().nullable()
            .test("fileType", "Only PNG and JPG images are allowed", (value) => {
                return !value || (value && (value.type === "image/png" || value.type === "image/jpeg"));
            })
            .test("required", function (value) {
                const { createError } = this;
                if (!party && !value) {
                    return createError({ path: this.path, message: "Image is required" });
                }
                return true;
            }),
    });

    useEffect(() => {
        if (party) {
            setInitialValues({ name: party.name, image: null });
            setImagePreview(`http://localhost:8080/uploads/parties/${party.image}`);
        } else {
            setInitialValues({ name: '', image: null });
            setImagePreview('');
        }
    }, [party]);

    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData();

        if (values.name !== initialValues.name) {
            formData.append("name", values.name);
        }

        if (values.image) {
            formData.append("image", values.image);
        }

        try {
            if (party) {
                await axios.put(`http://localhost:8080/api-admin/update-party-byId/${party._id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                toast.success("Party updated successfully");
            } else {
                await axios.post(`http://localhost:8080/api-admin/add-party`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                toast.success("Party created successfully");
            }
            onPartyUpdated();
            resetForm()
            setImagePreview("");
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Error saving party");
            }
            console.error("Error saving party:", error);
        }
    };

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue }) => (
                    <Form className="space-y-4">
                        <div>
                            <label className="block font-medium">Name:</label>
                            <Field
                                type="text"
                                name="name"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-600" />
                        </div>
                        <div>
                            <label className="block font-medium">Image:</label>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer"
                                onClick={() => document.getElementById("file-input").click()}
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
                                            setFieldValue("image", file);
                                            setImagePreview(URL.createObjectURL(file));
                                        } else {
                                            setFieldValue("image", null);
                                            toast.error("Only PNG and JPG images are allowed");
                                        }
                                    }}
                                    className="hidden"
                                />
                                <p className="text-gray-500">Click here to upload image</p>
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Image Preview"
                                        className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-300"
                                    />
                                )}
                            </div>
                            <ErrorMessage name="image" component="div" className="text-red-600" />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            {party ? "Update" : "Create"} Party
                        </button>
                    </Form>
                )}
            </Formik>
            <ToastContainer />
        </>
    );
};

export default PartyForm;
