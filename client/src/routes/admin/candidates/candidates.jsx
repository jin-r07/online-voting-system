import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editCandidateId, setEditCandidateId] = useState(null);

  const [currentImage, setCurrentImage] = useState(null);

  const [parties, setParties] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      partyId: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Candidate name is required"),
      partyId: Yup.string().required("Party selection is required"),
      image: Yup.mixed()
        .notRequired()
        .test("fileType", "Only .jpg and .png files are allowed", (value) => {
          return !value || (value && (value.type === "image/jpeg" || value.type === "image/png"));
        }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("partyId", values.partyId);

      if (values.image) {
        formData.append("image", values.image);
      }

      try {
        if (editCandidateId) {
          await axios.put(`http://localhost:8080/api-admin/edit-candidate/${editCandidateId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Candidate updated successfully!", {
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
        fetchCandidates();
        setIsModalOpen(false);
        formik.resetForm();
        setEditCandidateId(null);
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

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-all-candidates");
      setCandidates(response.data);
    } catch (err) {
      toast.error("Error fetching candidates", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Error fetching candidates:", err);
    }
  };

  const fetchParties = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-all-parties");
      setParties(response.data);
    } catch (err) {
      console.error("Error fetching parties:", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchParties();
  }, []);

  const handleDeleteCandidate = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this candidate?");
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api-admin/delete-candidate/${id}`);
      toast.success("Candidate deleted successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchCandidates();
    } catch (err) {
      toast.error("Error deleting candidate", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Error deleting candidate:", err);
    }
  };

  const handleEditCandidate = (candidate) => {
    setEditCandidateId(candidate._id);
    formik.setValues({
      name: candidate.name,
      partyId: candidate.party._id,
      image: null,
    });
    setCurrentImage(candidate.image);
    setIsModalOpen(true);
  };

  return (
    <div className="pl-80 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Candidates</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Add Candidate
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 z-10 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{editCandidateId ? 'Edit Candidate' : 'Create Candidate'}</h2>
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data" className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Candidate Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className={`mt-1 block w-full border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                  placeholder="Enter candidate name"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                )}
              </div>

              <div>
                <label htmlFor="partyId" className="block text-sm font-medium text-gray-700">Select Party</label>
                <select
                  id="partyId"
                  name="partyId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.partyId}
                  className={`mt-1 block w-full border ${formik.touched.partyId && formik.errors.partyId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                >
                  <option value="">Select a party</option>
                  {parties.map((party) => (
                    <option key={party._id} value={party._id}>
                      {party.name}
                    </option>
                  ))}
                </select>
                {formik.touched.partyId && formik.errors.partyId && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.partyId}</div>
                )}
              </div>

              {currentImage && (
                <div className="mb-4">
                  <img src={currentImage} alt="Current Candidate" className="w-full h-auto rounded-md mb-2" />
                </div>
              )}

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Candidate Image</label>
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
                  setEditCandidateId(null);
                  setCurrentImage(null);
                }} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">{editCandidateId ? 'Update Candidate' : 'Add Candidate'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold mt-10 text-gray-800">Existing Candidates</h3>
      <ul className="mt-4 space-y-4">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <li key={candidate._id} className="flex items-center border rounded-md p-4 bg-gray-50">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-16 h-16 mr-4 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-gray-900">{candidate.name}</span>
                <span className="text-sm text-gray-600">Party: {candidate.party.name}</span>
              </div>
              <div className="ml-auto flex space-x-2">
                <button
                  onClick={() => handleEditCandidate(candidate)}
                  className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCandidate(candidate._id)}
                  className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No candidates available.</li>
        )}
      </ul>
      <ToastContainer />
    </div>
  );
}
