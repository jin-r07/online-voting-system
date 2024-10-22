import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { useToast } from "../../../context/toast";

export default function Events() {
  const toast = useToast();

  const [candidates, setCandidates] = useState([]);

  const [events, setEvents] = useState([]);

  const [inactiveEvents, setInactiveEvents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const [editingEventId, setEditingEventId] = useState(null);

  const [openedEvents, setOpenedEvents] = useState({});

  const [eventType, setEventType] = useState("ongoing");

  const formik = useFormik({
    initialValues: {
      name: "",
      candidateIds: [],
      start: "",
      end: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Event name is required"),
      candidateIds: Yup.array().min(1, "At least one candidate must be selected"),
      start: Yup.date().required("Start date is required").nullable(),
      end: Yup.date().required("End date is required").nullable(),
    }),
    onSubmit: async (values) => {
      try {
        const { name, candidateIds, start, end } = values;

        const eventData = {
          name,
          candidateIds,
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
        };
        if (isEditMode) {
          await axios.put(`http://localhost:8080/api-admin/edit-event/${editingEventId}`, eventData);
          toast.success("Event updated successfully!");
        } else {
          const response = await axios.post("http://localhost:8080/api-admin/create-event", eventData);
          setEvents([...events, response.data]);
          toast.success("Event created successfully!");
        }
        await fetchEvents();
        await fetchInactiveEvents();
        setIsModalOpen(false);
        setIsEditMode(false);
        formik.resetForm();
      } catch (err) {
        toast.error("Error processing request");
      }
    },
  });

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-candidates");
      setCandidates(response.data);
    } catch (err) {
      toast.error("Error processing request");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-events");
      setEvents(response.data);
    } catch (err) {
      toast.error("Error processing request");
    }
  };

  const fetchInactiveEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-events-inactive");
      setInactiveEvents(response.data);
    } catch (err) {
      toast.error("Error processing request");
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchEvents();
    fetchInactiveEvents();
  }, []);

  const handleEditEvent = (event) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditingEventId(event._id);
    formik.setFieldValue("name", event.eventName);
    formik.setFieldValue("candidateIds", event.candidates.map((candidate) => candidate._id));
    formik.setFieldValue("start", new Date(new Date(event.start).getTime() + (5 * 60 + 45) * 60 * 1000).toISOString().slice(0, 16));
    formik.setFieldValue("end", new Date(new Date(event.end).getTime() + (5 * 60 + 45) * 60 * 1000).toISOString().slice(0, 16));
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/api-admin/delete-event/${eventId}`);
        setEvents(events.filter((event) => event._id !== eventId));
        toast.success("Event deleted successfully!");
        await fetchEvents();
        await fetchInactiveEvents();
      } catch (err) {
        toast.error("Error processing request");
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
        <h2 className="text-3xl mb-6 text-gray-800">Manage Events</h2>
        <button
          className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none shadow"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditMode(false);
            formik.resetForm();
          }}
        >
          Create New Event
        </button>

        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="ml-4 mb-4 p-2 border-[1px] border-gray-300 rounded-md cursor-pointer"
        >
          <option value="ongoing">Ongoing</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" />
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg z-10">
            <h3 className="text-xl mb-4">{isEditMode ? "Edit Event" : "Create Event"}</h3>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                        checked={formik.values.candidateIds.includes(candidate._id)}
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

              <div>
                <label htmlFor="start" className="block text-sm text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  id="start"
                  name="start"
                  type="datetime-local"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.start}
                />
                {formik.touched.start && formik.errors.start ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.start}</div>
                ) : null}
              </div>

              <div>
                <label htmlFor="end" className="block text-sm text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  id="end"
                  name="end"
                  type="datetime-local"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.end}
                />
                {formik.touched.end && formik.errors.end ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.end}</div>
                ) : null}
              </div>

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

      <div className="flex flex-col w-full h-full">
        <div className="w-full max-h-1/2 overflow-y-auto">
          <h3 className="text-2xl mt-10 text-gray-800 mb-8">
            {eventType === "ongoing" ? "Ongoing Events" : "Upcoming Events"}
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {(eventType === "ongoing" ? events : inactiveEvents).length > 0 ? (
              (eventType === "ongoing" ? events : inactiveEvents).map((event) => (
                <div key={event._id} className="bg-white shadow-md rounded-lg p-6 border-[1px] border-gray-300 mr-12">
                  <h4 className="text-xl text-gray-800 flex justify-between items-center">
                    {event.eventName}
                    <div className="flex items-center space-x-2 text-base">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition duration-200"
                      >
                        Delete
                      </button>
                      <button onClick={() => toggleCandidates(event._id)}>
                        {openedEvents[event._id] ? (
                          <RiArrowUpSFill className="text-4xl" />
                        ) : (
                          <RiArrowDownSFill className="text-4xl" />
                        )}
                      </button>
                    </div>
                  </h4>

                  {openedEvents[event._id] && (
                    <ul className="list-none max-h-72 pl-5 space-y-1 overflow-y-auto">
                      <div className="sticky top-0 bg-white text-gray-600">
                        <p>
                          <strong>Start:&nbsp;</strong>
                          {new Date(event.start).toLocaleString()}
                        </p>
                        <p>
                          <strong>End:&nbsp;</strong>
                          {new Date(event.end).toLocaleString()}
                        </p>
                        <p>
                          <strong>Status:&nbsp;</strong>
                          {capitalizeFirstLetter(event.status)}
                        </p>
                        <p>
                          <strong>Candidates:</strong>
                        </p>
                      </div>
                      {event.candidates.map((candidate) => (
                        <div key={candidate._id} className="text-gray-700 flex items-center pb-4">
                          <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="w-14 h-auto rounded-sm mr-2"
                          />
                          <div className="flex flex-col">
                            <span>{candidate.name}</span>
                            <span className="text-gray-500">Party:&nbsp;{candidate.party?.name}</span>
                          </div>
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
        </div>
      </div>
    </div>
  );
}