import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Events() {
  const [candidates, setCandidates] = useState([]);  // Store fetched candidates

  // Fetch candidates on component mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api-admin/get-candidates");
        setCandidates(response.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
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
      }
    };
    fetchCandidates();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      candidateIds: [],  // Array to store selected candidate IDs
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Event name is required"),
      candidateIds: Yup.array().min(1, "At least one candidate must be selected"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:8080/api-admin/create-event", values);
        toast.success("Event created successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log("Event created:", response.data);
      } catch (err) {
        toast.error("Error creating event", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Error creating event:", err);
      }
    },
  });

  return (
    <div className="pl-72">
      <h2>Create Event</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name">Event Name</label>
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
          <label htmlFor="candidateIds">Select Candidates</label>
          <select
            id="candidateIds"
            name="candidateIds"
            multiple
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.candidateIds}
          >
            {candidates.map((candidate) => (
              <option key={candidate._id} value={candidate._id}>
                {candidate.name} ({candidate.party.name})
              </option>
            ))}
          </select>
          {formik.touched.candidateIds && formik.errors.candidateIds ? (
            <div>{formik.errors.candidateIds}</div>
          ) : null}
        </div>

        <button type="submit">Create Event</button>
      </form>

      <ToastContainer />
    </div>
  );
}
