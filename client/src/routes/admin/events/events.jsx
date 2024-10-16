import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiArrowUpSFill, RiArrowDownSFill, RiEdit2Fill, RiDeleteBin2Fill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Events() {
  const [candidates, setCandidates] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
  const [editingEventId, setEditingEventId] = useState(null); // Track the event being edited
  const [openedEvents, setOpenedEvents] = useState({}); // Track opened events for toggle

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api-admin/get-candidates");
        setCandidates(response.data);
      } catch (err) {
        toast.error("Error fetching candidates");
        console.error(err);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api-admin/get-events");
        setEvents(response.data);
      } catch (err) {
        toast.error("Error fetching events");
        console.error(err);
      }
    };

    fetchCandidates();
    fetchEvents();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      candidateIds: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Event name is required"),
      candidateIds: Yup.array().min(1, "At least one candidate must be selected"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEditMode) {
          // Edit existing event
          await axios.put(`http://localhost:8080/api-admin/update-event/${editingEventId}`, values);
          toast.success("Event updated successfully!");
        } else {
          // Create new event
          const response = await axios.post("http://localhost:8080/api-admin/create-event", values);
          setEvents([...events, response.data]);
          toast.success("Event created successfully!");
        }
        setIsModalOpen(false);
        setIsEditMode(false);
        formik.resetForm();
      } catch (err) {
        toast.error(isEditMode ? "Error updating event" : "Error creating event");
        console.error(err);
      }
    },
  });

  const handleEditEvent = (event) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditingEventId(event._id);
    formik.setFieldValue("name", event.eventName);
    formik.setFieldValue(
      "candidateIds",
      event.candidates.map((candidate) => candidate._id)
    );
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/api-admin/delete-event/${eventId}`);
        setEvents(events.filter((event) => event._id !== eventId));
        toast.success("Event deleted successfully!");
      } catch (err) {
        toast.error("Error deleting event");
        console.error("Error deleting event:", err);
      }
    }
  };

  const toggleCandidates = (eventId) => {
    setOpenedEvents((prevOpenedEvents) => ({
      ...prevOpenedEvents,
      [eventId]: !prevOpenedEvents[eventId],
    }));
  };

  return (
    <div className="pl-80 mx-auto bg-white rounded-lg">
      <div className="sticky top-0 bg-white shadow-md py-6">
        <h2 className="text-3xl mb-6 text-gray-800">Events</h2>
        <button
          className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none shadow"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditMode(false); // Ensure it's not in edit mode when creating a new event
            formik.resetForm(); // Reset the form for creating a new event
          }}
        >
          Create New Event
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" />
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg z-10">
            <h3 className="text-xl mb-4">{isEditMode ? "Edit Event" : "Create Event"}</h3>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Event name input */}
              <div>
                <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
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

              {/* Candidates selection */}
              <div>
                <label className="block text-sm mb-2">Select Candidates</label>
                <div className="flex flex-col space-y-2 h-96 overflow-y-auto border border-gray-300 p-4 rounded-md">
                  {candidates.map((candidate) => (
                    <div key={candidate._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`candidate-${candidate._id}`}
                        name="candidateIds"
                        value={candidate._id}
                        className="mr-2 w-4 h-4 cursor-pointer"
                        checked={formik.values.candidateIds.includes(candidate._id)} // Pre-check selected candidates
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
                      <label htmlFor={`candidate-${candidate._id}`} className="flex items-center w-full">
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="w-12 h-auto rounded-sm mr-2"
                        />
                        <div className="text-sm text-gray-700">
                          <p>{candidate.name}</p>
                          <p className="text-gray-500">Party: {candidate.party.name}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                {formik.touched.candidateIds && formik.errors.candidateIds ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.candidateIds}</div>
                ) : null}
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isEditMode ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events listing */}
      <h3 className="text-2xl mt-10 text-gray-800 mb-8">Existing Events</h3>
      <div className="grid grid-cols-1 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mr-12">
              <h4 className="text-xl text-gray-800 mb-2 flex justify-between items-center">
                {event.eventName}
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEditEvent(event)}>
                    <RiEdit2Fill className="text-2xl text-blue-500" />
                  </button>
                  <button onClick={() => handleDeleteEvent(event._id)}>
                    <RiDeleteBin2Fill className="text-2xl text-red-500" />
                  </button>
                  <button onClick={() => toggleCandidates(event._id)}>
                    {openedEvents[event._id] ? <RiArrowUpSFill className="text-4xl" /> : <RiArrowDownSFill className="text-4xl" />}
                  </button>
                </div>
              </h4>

              {/* Toggle to show/hide candidates */}
              {openedEvents[event._id] && (
                <ul className="list-disc pl-5 space-y-1 mt-2 overflow-y-auto">
                  <h3 className="text-lg">Candidates:</h3>
                  {event.candidates.map((candidate) => (
                    <div key={candidate._id} className="text-gray-700 flex items-center pb-4">
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-14 h-auto rounded-sm mr-2"
                      />
                      <span>{candidate.name}</span>
                      <span className="ml-2 text-gray-500">({candidate.party?.name})</span>
                    </div>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <div className="py-3 text-gray-500">No events found.</div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
