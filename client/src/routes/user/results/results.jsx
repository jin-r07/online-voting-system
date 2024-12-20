import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../../context/toast";
import { LuVote } from "react-icons/lu";
import { FaRegTimesCircle } from "react-icons/fa";
import Footer from "../../../components/user/footer/footer";
import { useNavigate } from "react-router-dom";

export default function Results() {
    const toast = useToast();

    const [eventData, setEventData] = useState(null);

    const navigate = useNavigate();

    const fetchEventData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api-admin/get-events-completed");
            setEventData(response.data);
        } catch (err) {
            toast.error("Error fetching event details");
        }
    };

    useEffect(() => {
        fetchEventData();
    }, []);

    if (!eventData) {
        return <div className="text-center text-xl py-10">Loading...</div>;
    }

    const handleRedirectToVote = (eventId) => {
        navigate(`/results/${eventId}`);
    };

    return (
        <div className="w-full h-screen flex flex-col bg-gradient-to-b from-gray-100 via-white to-gray-50">
            <div className="flex-grow py-10 px-4 lg:px-28">
                <h2 className="lg:text-3xl text-xl font-extrabold mb-8">Completed Vote Events Results</h2>

                {eventData.length > 0 ? (
                    <div className="w-full h-full">
                        {eventData.map((event) => (
                            <div
                                key={event._id}
                                className="bg-white lg:p-6 p-3 border-black border-[1px] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8"
                            >
                                <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center">
                                    <h3 className="ml-4 lg:text-2xl text-lg font-semibold text-gray-900">{event.eventName}</h3>
                                    <div className="flex items-center">
                                        {event.status === "completed" ? (
                                            <LuVote className="text-green-500 text-3xl mr-4" />
                                        ) : (
                                            <FaRegTimesCircle className="text-red-500 text-2xl  mr-4" />
                                        )}
                                        <button onClick={() => handleRedirectToVote(event._id)}
                                            className="w-fit lg:mt-0 mt-4 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 hover:scale-105">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 border-black border-[1px] rounded-md">
                        <p className="text-2xl">No completed voting events.</p>
                        <p className="text-lg">Please check back later for updates on completed vote events.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
