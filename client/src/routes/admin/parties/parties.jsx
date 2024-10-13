import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Parties() {
  const formik = useFormik({
    initialValues: {
      name: "",
      shortName: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Party name is required"),
      shortName: Yup.string().required("Short name is required"),
      image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("shortName", values.shortName);
      formData.append("image", values.image);

      try {
        const response = await axios.post("/api/parties", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Party created successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log("Party created:", response.data);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data.error || "Party already exists.", {
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
          toast.error("Error creating party", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        console.error("Error creating party:", err);
      }
    },
  });

  return (
    <div className="ml-96">
      <h2>Create Party</h2>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="name">Party Name</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div>{formik.errors.name}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="shortName">Party Short Name</label>
          <input
            id="shortName"
            name="shortName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.shortName}
          />
          {formik.touched.shortName && formik.errors.shortName ? (
            <div>{formik.errors.shortName}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="image">Party Image</label>
          <input
            id="image"
            name="image"
            type="file"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.image && formik.errors.image ? (
            <div>{formik.errors.image}</div>
          ) : null}
        </div>

        <button type="submit">Create Party</button>
      </form>

      <ToastContainer />
    </div>
  );
}
