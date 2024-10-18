import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VotePage() {
    const { eventId } = useParams();

    const [eventData, setEventData] = useState(null);

    const fetchEventData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api-admin/get-events/${eventId}`);
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
    }, [eventId]);

    if (!eventData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mb-6">
            <h2 className="text-xl mb-4">{eventData.eventName} - All Candidates</h2>
            <div className="flex flex-wrap -mx-4">
                {eventData.candidates.map((candidate, index) => (
                    <div key={candidate._id} className="w-full md:w-1/2 px-4 mb-10">
                        <div className="flex items-center p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                            <img src={candidate.image} alt={candidate.name}
                                className="w-20 h-auto rounded-md border-2 border-gray-300" />
                            <div className="ml-4">
                                <p className="text-lg text-gray-800">{candidate.name}</p>
                                <p className="text-sm text-gray-500">Votes: {candidate.votes}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-sm text-gray-400">Rank: {index + 1}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}
