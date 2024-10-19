import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../../../components/user/footer/footer";
import { formatDate } from "../../../utils/formatDate&Time";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";

export default function Vote() {
    const [eventData, setEventData] = useState(null);

    const fetchEventData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api-admin/get-events");
            setEventData(response.data);
        } catch (err) {
            toast.error("Error fetching event details", {
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
        fetchEventData();
    }, []);

    if (!eventData) {
        return <div className="text-center text-xl py-10">Loading...</div>;
    }

    return (
        <div className="w-full h-full min-h-screen flex flex-col bg-gradient-to-b from-gray-100 via-white to-gray-50">
            <div className="flex-grow py-10 px-4 lg:px-28">
                <h2 className="text-3xl font-extrabold mb-8 text-center">Vote for an Event</h2>

                {eventData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {eventData.map((event) => (
                            <div
                                key={event._id}
                                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-semibold text-gray-900">{event.eventName}</h3>
                                    {event.status === 'active' ? (
                                        <FaRegCheckCircle className="text-green-500 text-2xl" />
                                    ) : (
                                        <FaRegTimesCircle className="text-red-500 text-2xl" />
                                    )}
                                </div>
                                <p className="text-gray-600 text-lg mb-2">
                                    <strong>Status:</strong>&nbsp;{event.status}
                                </p>
                                <p className="text-gray-600 text-lg mb-2">
                                    <strong>Start Date:</strong>&nbsp;{formatDate(event.start)}
                                </p>
                                <p className="text-gray-600 text-lg mb-2">
                                    <strong>End Date:</strong>&nbsp;{formatDate(event.end)}
                                </p>
                                <div className="flex justify-end">
                                    <button className="mt-6 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                                        Vote Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-lg">No Active Events</p>
                )}
            </div>
            <Footer />
        </div>
    );
}
