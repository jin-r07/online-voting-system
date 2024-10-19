import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../../../components/user/footer/footer";
import { formatDate } from "../../../utils/formatDate&Time";

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
        return <div>Loading...</div>;
    }
    return (
        <div className="w-full h-full min-h-screen flex flex-col">
            <div className="flex-grow p-6">
                <h2 className="text-2xl font-bold mb-6">Vote for an Event</h2>
                {eventData ? (
                    <ul className="list-none space-y-4">
                        {eventData.map((event) => (
                            <li key={event._id} className="bg-gray-100 p-4 rounded shadow-md">
                                <h3 className="text-lg font-semibold">{event.eventName}</h3>
                                <p>Status: {event.status}</p>
                                <p>Start Date: {new Date(event.start).toLocaleString()}</p>
                                <p>End Date: {new Date(event.end).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No Active Events</p>
                )}
            </div>
            <Footer />
        </div>
    );
}
