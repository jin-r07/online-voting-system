import React, { useEffect, useState } from "react";
import axios from "axios";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { useToast } from "../../../context/toast";
import { LuUserCheck2 } from "react-icons/lu";
import { FaRegTimesCircle } from "react-icons/fa";
import { RxDownload } from "react-icons/rx";
import { formatDate } from "../../../utils/formatDate&Time";
import Footer from "../../../components/user/footer/footer";

export default function Results() {
    const toast = useToast();

    const [eventData, setEventData] = useState(null);

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

    return (
        <div className="w-full h-screen flex flex-col bg-gradient-to-b from-gray-100 via-white to-gray-50">
            <div className="flex-grow py-10 px-4 lg:px-28">
                <h2 className="text-3xl font-extrabold mb-8">Completed Vote Events Results</h2>

                {eventData.length > 0 ? (
                    <div className="w-full">
                        {eventData.map((event) => (
                            <div
                                key={event._id}
                                className="bg-white p-6 border-black border-[1px] rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-semibold text-gray-900">{event.eventName}</h3>
                                    <div className="flex items-center">
                                        {event.status === "completed" ? (
                                            <LuUserCheck2 className="text-green-500 text-3xl" />
                                        ) : (
                                            <FaRegTimesCircle className="text-red-500 text-2xl" />
                                        )}
                                        <button className="bg-blue-600 ml-6 p-2.5 rounded-md hover:bg-blue-700 transition-all duration-300 hover:scale-105">
                                            <RxDownload className="text-xl text-white" />
                                        </button>
                                        <button
                                            className="ml-3 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 hover:scale-105">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 border-black border-[1px] rounded-md">
                        <p className="text-2xl">No active voting events available at the moment.</p>
                        <p className="text-lg">Please check back later for updates on upcoming vote events.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
