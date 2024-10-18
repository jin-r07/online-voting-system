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

    const startDate = new Date(eventData.start.$date).toLocaleString();

    const endDate = new Date(eventData.end.$date).toLocaleString();

    return (
        <div className="mb-6 px-4">
            <h2 className="text-2xl font-bold mb-4">{eventData.eventName}</h2>
            <h2 className="text-2xl font-bold mb-4">All Candidates</h2>
            <div className="mb-4">
                <p className="text-lg">Status: <span className="font-semibold">{eventData.status}</span></p>
                <p className="text-lg">Start Date: <span className="font-semibold">{startDate}</span></p>
                <p className="text-lg">End Date: <span className="font-semibold">{endDate}</span></p>
            </div>
            <div className="flex flex-wrap -mx-4">
                {eventData.candidates.map((candidate, index) => (
                    <div key={candidate._id} className="w-full md:w-1/3 px-4 mb-6">
                        <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                            <img src={candidate.image} alt={candidate.name}
                                className="w-24 h-24 rounded-full border-2 border-gray-300 mb-2" />
                            <h3 className="text-lg text-gray-800">{candidate.name}</h3>
                            <p className="text-sm text-gray-500">Votes: {candidate.votes}</p>
                            <p className="text-sm text-gray-400">Rank: {index + 1}</p>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}
