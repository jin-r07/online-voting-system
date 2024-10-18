import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function TopCandidates() {
    const [votingData, setVotingData] = useState([]);

    console.log(votingData);

    const navigate = useNavigate();

    const fetchOngoingEvents = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api-admin/get-events");
            setVotingData(response.data);
        } catch (err) {
            toast.error("Error fetching candidates", {
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
        fetchOngoingEvents();
    }, []);

    const handleRedirectToVote = (eventId) => {
        navigate(`/vote/${eventId}`);
    };

    const noData = !votingData.length;

    return (
        <div className="mb-6">
            {noData ? (
                <div className="text-center py-10">
                    <p className="text-xl">No events available at the moment.</p>
                    <p>Please check back later for updates on upcoming vote events.</p>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl mb-4">Top Candidates</h2>
                    <div className="flex flex-wrap -mx-4">
                        {votingData.map((event, index) => (
                            <div key={index} className="w-full md:w-1/2 px-4 mb-10">
                                <h3 className="text-xl mb-4">Event: {event.eventName}</h3>
                                <div className="space-y-6">
                                    {event.candidates.slice(0, 3).map((candidate, idx) => (
                                        <div key={candidate._id}
                                            className="flex items-center p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                                            <img src={candidate.partyImage} alt={candidate.party.name} className="w-20 h-auto rounded-md object-cover object-center" />
                                            <div className="ml-4">
                                                <p className="text-lg text-gray-800">{candidate.party.name}</p>
                                                <p className="text-sm text-gray-500">Votes: {candidate.votes}</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="text-sm text-gray-400">Rank: {idx + 1}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleRedirectToVote(event._id)}
                                    className="mt-4 text-lg text-blue-500 no-underline hover:underline"
                                >
                                    See more
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
