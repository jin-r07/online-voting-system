import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Parties() {
  const [parties, setParties] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      shortName: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Party name is required"),
      shortName: Yup.string().required("Short name is required"),
      image: Yup.mixed()
        .required("Image is required")
        .test("fileType", "Only .jpg and .png files are allowed", (value) => {
          return value && (value.type === "image/jpeg" || value.type === "image/png");
        }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("shortName", values.shortName);
      formData.append("image", values.image);

      try {
        const response = await axios.post("http://localhost:8080/api-admin/add-party", formData, {
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
        fetchParties();
        setIsModalOpen(false);
        formik.resetForm();
        setImagePreview(null);
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

  const fetchParties = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-all-parties");
      setParties(response.data);
    } catch (err) {
      console.error("Error fetching parties:", err);
      toast.error("Error fetching parties", {
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
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    formik.resetForm();
    setImagePreview(null);
  };

  return (
    <div className="ml-72 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Parties</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Add Party
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 z-10 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create Party</h2>
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data" className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Party Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className={`mt-1 block w-full border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                  placeholder="Enter party name"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                )}
              </div>

              <div>
                <label htmlFor="shortName" className="block text-sm font-medium text-gray-700">Party Short Name</label>
                <input
                  id="shortName"
                  name="shortName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.shortName}
                  className={`mt-1 block w-full border ${formik.touched.shortName && formik.errors.shortName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                  placeholder="Enter short name"
                />
                {formik.touched.shortName && formik.errors.shortName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.shortName}</div>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Party Image</label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full border ${formik.touched.image && formik.errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                />
                {formik.touched.image && formik.errors.image && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.image}</div>
                )}
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Image Preview</h3>
                  <img src={imagePreview} alt="Preview" className="mt-2 w-full h-auto rounded-md shadow-md" />
                </div>
              )}

              <div className="flex justify-between">
                <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">Create Party</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold mt-10 text-gray-800">Existing Parties</h3>
      <ul className="mt-4 space-y-4">
        {parties.length > 0 ? (
          parties.map((party) => (
            <li key={party._id} className="flex items-center border rounded-md p-4 bg-gray-50 shadow-sm">
              <img
                src={party.image}
                alt={party.name}
                className="w-16 h-16 mr-4 rounded-full shadow"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-gray-900">{party.name}</span>
                <span className="text-sm text-gray-600">({party.shortName})</span>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No parties available.</li>
        )}
      </ul>
      <ToastContainer />
    </div>
  );
}
