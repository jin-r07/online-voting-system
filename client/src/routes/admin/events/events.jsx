import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Events() {
  const [candidates, setCandidates] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal visibility

  // Fetch candidates and existing events on component mount
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

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api-admin/get-events");
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Error fetching events", {
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
    fetchEvents();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      candidateIds: [], // Store selected candidate IDs
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
        setEvents([...events, response.data]); // Add the new event to the list
        formik.resetForm(); // Reset the form after successful submission
        setIsModalOpen(false); // Close the modal after submission
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
      <h2 className="text-2xl font-semibold mb-6">Existing Events</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        onClick={() => setIsModalOpen(true)}
      >
        Create New Event
      </button>
      <ul className="mb-6">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event._id} className="p-3 border-b border-gray-300">
              {event.name} - Candidates: {event.candidateIds.join(", ")}
            </li>
          ))
        ) : (
          <li className="p-3 text-gray-500">No events found.</li>
        )}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" />
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg z-10">
            <h3 className="text-xl font-semibold mb-4">Create Event</h3>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.name}</div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Candidates
                </label>
                <div className="flex flex-col space-y-2 h-96 overflow-y-auto">
                  {candidates.map((candidate) => (
                    <div key={candidate._id} className="flex items-center border-gray-500 border-[1px]">
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-14 h-auto mr-4 object-cover object-center"
                      />
                      <input
                        type="checkbox"
                        id={`candidate-${candidate._id}`}
                        name="candidateIds"
                        value={candidate._id}
                        className="mr-2"
                        onChange={(event) => {
                          const { checked } = event.target;
                          const selectedIds = formik.values.candidateIds;
                          if (checked) {
                            formik.setFieldValue("candidateIds", [...selectedIds, candidate._id]);
                          } else {
                            formik.setFieldValue(
                              "candidateIds",
                              selectedIds.filter((id) => id !== candidate._id)
                            );
                          }
                        }}
                      />
                      <label htmlFor={`candidate-${candidate._id}`} className="text-sm text-gray-700">
                        <p>{candidate.name}</p>
                        <p>({candidate.party.name})</p>
                      </label>
                    </div>
                  ))}
                </div>
                {formik.touched.candidateIds && formik.errors.candidateIds ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.candidateIds}</div>
                ) : null}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Event
                </button>
              </div>
            </form>
            <button
              className="mt-4 text-red-500 hover:underline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
