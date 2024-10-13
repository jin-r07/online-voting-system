import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Parties() {
  const [parties, setParties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPartyId, setEditPartyId] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

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
        .notRequired() // Change here: make image optional for edits
        .test("fileType", "Only .jpg and .png files are allowed", (value) => {
          return !value || (value && (value.type === "image/jpeg" || value.type === "image/png"));
        }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("shortName", values.shortName);

      // Only append image if it's provided
      if (values.image) {
        formData.append("image", values.image);
      }

      try {
        if (editPartyId) {
          await axios.put(`http://localhost:8080/api-admin/edit-party/${editPartyId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Party updated successfully!", {
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
          fetchParties();
        }

        setIsModalOpen(false);
        formik.resetForm();
        setEditPartyId(null);
        setCurrentImage(null);
      } catch (err) {
        toast.error("Error processing request", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Error:", err);
      }
    },
  });

  const fetchParties = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-all-parties");
      setParties(response.data);
    } catch (err) {
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
      console.error("Error fetching parties:", err);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const handleDeleteParty = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this party?");
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api-admin/delete-party/${id}`);
      toast.success("Party deleted successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchParties();
    } catch (err) {
      toast.error("Error deleting party", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Error deleting party:", err);
    }
  };

  const handleEditParty = (party) => {
    setEditPartyId(party._id);
    formik.setValues({
      name: party.name,
      shortName: party.shortName,
      image: null,
    });
    setCurrentImage(party.image);
    setIsModalOpen(true);
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">{editPartyId ? 'Edit Party' : 'Create Party'}</h2>
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

              {currentImage && (
                <div className="mb-4">
                  <img src={currentImage} alt="Current Party" className="w-full h-auto rounded-md mb-2" />
                </div>
              )}

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Party Image</label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  onChange={(event) => {
                    formik.setFieldValue("image", event.currentTarget.files[0]);
                    setCurrentImage(URL.createObjectURL(event.currentTarget.files[0]));
                  }}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full border ${formik.touched.image && formik.errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                />
                {formik.touched.image && formik.errors.image && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.image}</div>
                )}
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => {
                  setIsModalOpen(false);
                  formik.resetForm();
                  setEditPartyId(null);
                  setCurrentImage(null);
                }} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">{editPartyId ? 'Update Party' : 'Add Party'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold mt-10 text-gray-800">Existing Parties</h3>
      <ul className="mt-4 space-y-4">
        {parties.length > 0 ? (
          parties.map((party) => (
            <li key={party._id} className="flex items-center border rounded-md p-4 bg-gray-50">
              <img
                src={party.image}
                alt={party.name}
                className="w-16 h-16 mr-4 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-gray-900">{party.name}</span>
                <span className="text-sm text-gray-600">({party.shortName})</span>
              </div>
              <div className="ml-auto flex space-x-2">
                <button
                  onClick={() => handleEditParty(party)}
                  className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteParty(party._id)}
                  className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
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