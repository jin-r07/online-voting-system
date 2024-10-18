import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsPatchCheckFill } from "react-icons/bs";

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
        <div className="mb-6 lg:px-28 px-4 pt-10 bg-gray-50 min-h-screen">
            <h2 className="text-4xl font-semibold mb-8 text-gray-800">Event: {eventData.eventName}</h2>
            <div className="mb-4 text-xl">
                <p className="flex items-center"><strong>Status:&nbsp;</strong><span>{capitalizeFirstLetter(eventData.status)}</span><BsPatchCheckFill className="ml-2" /></p>
                <p><strong>Start Date:&nbsp;</strong><span>{startDate}</span></p>
                <p><strong>End Date:&nbsp;</strong><span>{endDate}</span></p>
            </div>
            <h2 className="text-2xl my-8">All Candidates:</h2>
            <div className="flex flex-wrap -mx-4 justify-center">
                {eventData.candidates.map((candidate) => {
                    return (
                        <div key={candidate._id} className="w-full md:w-1/3 px-4 mb-6">
                            <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{candidate.party.name}</h3>
                                <img src={candidate.partyImage} alt={candidate.party.name} className="w-24 h-auto rounded-md mb-4" />
                                <div className="flex items-center mb-2">
                                    <img
                                        src={candidate.image}
                                        alt={candidate.name}
                                        className="w-16 h-auto rounded-md border border-gray-300 mr-3"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-lg font-medium text-gray-700">{candidate.name}</p>
                                        <p className="text-md text-gray-500">Votes: <span className="font-bold">{candidate.votes}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ToastContainer />
        </div>
    );
}
