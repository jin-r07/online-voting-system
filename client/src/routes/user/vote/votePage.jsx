import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
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

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kathmandu',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    const startDate = formatDate(eventData.start);

    const endDate = formatDate(eventData.end);

    return (
        <div className="mb-6 lg:px-28 px-4 pt-10">
            <h2 className="text-4xl font-semibold mb-8">Event: {eventData.eventName}</h2>
            <div className="mb-4 text-xl">
                <p><strong>Status: </strong><span>{capitalizeFirstLetter(eventData.status)}</span></p>
                <p><strong>Start Date: </strong><span>{startDate}</span></p>
                <p><strong>End Date: </strong><span>{endDate}</span></p>
            </div>
            <h2 className="text-2xl my-8">All Candidates:</h2>
            <div className="flex flex-wrap -mx-4">
                {eventData.candidates.map((candidate, index) => (
                    <div key={candidate._id} className="w-full md:w-1/3 px-4 mb-6">
                        <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-200">
                            <img src={candidate.image} alt={candidate.name} className="w-24 h-auto rounded-md mb-2" />
                            <h3 className="text-lg text-gray-800">{candidate.name}</h3>
                            <p className="text-lg text-gray-500">Votes: {candidate.votes}</p>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}
