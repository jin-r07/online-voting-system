import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/toast";

export default function TopCandidates() {
    const toast = useToast();

    const [votingData, setVotingData] = useState(null);

    const [votesData, setVotesData] = useState({});

    const navigate = useNavigate();

    const fetchOngoingEvents = async () => {
        try {
            const eventsResponse = await axios.get("http://localhost:8080/api-admin/get-events");
            const events = eventsResponse.data;
            setVotingData(events);

            if (events.length > 0) {
                const allVotesData = {};
                for (let event of events) {
                    const eventId = event._id;
                    const eventVotes = await fetchVoteData(eventId);
                    allVotesData[eventId] = eventVotes;
                }
                setVotesData(allVotesData);
            }
        } catch (err) {
            toast.error("Error fetching candidates");
        }
    };

    const fetchVoteData = async (eventId) => {
        try {
            const votesResponse = await axios.get("http://localhost:8080/api/get-vote-data", {
                params: { eventId },
                withCredentials: true,
            });
            return votesResponse.data;
        } catch (err) {
            toast.error(`Error fetching vote data for event ${eventId}`);
            return {};
        }
    };

    useEffect(() => {
        fetchOngoingEvents();
    }, []);

    const handleRedirectToVote = (eventId) => {
        navigate(`/vote/${eventId}`);
    };

    if (!votingData) {
        return <div className="text-center text-xl py-10">Loading...</div>;
    }

    return (
        <div className="mb-6">
            {votingData.length > 0 ? (
                <div className="flex flex-wrap -mx-4">
                    {votingData.map((event, index) => (
                        <div key={index} className="w-full md:w-1/2 px-4 mb-10">
                            <h3 className="text-xl mb-4 font-semibold">{event.eventName}</h3>
                            <div className="space-y-6">
                                {event.candidates
                                    .sort((a, b) => (votesData[event._id]?.[b._id] || 0) - (votesData[event._id]?.[a._id] || 0))
                                    .slice(0, 3)
                                    .map((candidate) => {
                                        const totalVotes = votesData[event._id]?.[candidate._id] || 0;
                                        return (
                                            <div
                                                key={candidate._id}
                                                className="flex items-center p-4 bg-white shadow-lg rounded-lg border-[1px] border-gray-300"
                                            >
                                                <img
                                                    src={candidate.partyImage}
                                                    alt={candidate.party.name}
                                                    className="w-20 h-auto rounded-sm object-cover object-center"
                                                />
                                                <div className="ml-4">
                                                    <p className="text-lg text-gray-800">{candidate.party.name.replace(/_/g, " ")}</p>
                                                    <p className="text-base">Votes: {totalVotes}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
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
            ) : (
                <div className="text-center py-10 border-black border-[1px] rounded-md">
                    <p className="text-2xl">No active voting events available at the moment.</p>
                    <p className="text-lg">Please check back later for updates on vote events.</p>
                </div>
            )}
        </div>
    );
}
