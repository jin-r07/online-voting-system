import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import Footer from "../../../components/user/footer/footer";
import { formatDate } from "../../../utils/formatDate&Time";
import { useToast } from "../../../context/toast";

export default function VotePage() {
    const toast = useToast();

    const { eventId } = useParams();

    const [eventData, setEventData] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const [votesData, setVotesData] = useState({});

    const [hasVoted, setHasVoted] = useState(false);

    const fetchEventData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api-admin/get-events/${eventId}`);
            setEventData(response.data);

            const votesResponse = await axios.get("http://localhost:8080/api/get-vote-data");
            setVotesData(votesResponse.data);
        } catch (err) {
            toast.error("Error fetching event details");
        }
    };

    const checkUserVoteStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/vote-status`, {
                params: { eventId },
                withCredentials: true,
            });
            setHasVoted(response.data.hasVoted);
        } catch (err) {
            setHasVoted(false);
        }
    };

    useEffect(() => {
        fetchEventData();
        checkUserVoteStatus();
    }, [eventId]);

    if (!eventData) {
        return <div className="text-center text-xl py-10">Loading...</div>;
    }

    const startDate = formatDate(eventData.start);
    const endDate = formatDate(eventData.end);

    const openModal = (candidate) => {
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCandidate(null);
    };

    const submitVote = async () => {
        if (!selectedCandidate) return;

        try {
            const voteData = {
                eventId,
                candidateId: selectedCandidate._id
            };

            const response = await axios.post("http://localhost:8080/api/vote", voteData, { withCredentials: true });

            toast.success(response.data.message);
            setHasVoted(true);
            await fetchEventData();
            closeModal();
        } catch (err) {
            toast.error(err.response?.data?.message || "You must be logged in to vote.");
        }
    };

    return (
        <>
            <div className="mb-8 lg:px-28 px-4 pt-10 bg-gray-50 w-full h-full">
                <h2 className="xl:text-2xl text-xl font-semibold mb-8">{eventData.eventName}</h2>
                <div className="mb-4 xl:text-xl text-lg">
                    <p><strong>Status:&nbsp;</strong><span>{capitalizeFirstLetter(eventData.status)}</span></p>
                    <p><strong>Start Date:&nbsp;</strong><span>{startDate}</span></p>
                    <p><strong>End Date:&nbsp;</strong><span>{endDate}</span></p>
                </div>
                <h2 className="text-xl font-semibold my-8">All Candidates:</h2>
                <ul className="space-y-6">
                    {eventData.candidates.map((candidate) => {
                        const totalVotes = votesData[candidate._id] || 0;
                        return (
                            <li key={candidate._id} className="flex items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl border border-gray-200">
                                <img src={candidate.partyImage} alt={candidate.party.name} className="w-20 h-auto rounded-sm mr-4" />
                                <div className="flex-1">
                                    <h3 className="lg:text-xl text-lg font-semibold text-gray-800 mb-1">{candidate.party.name}</h3>
                                    <div className="flex items-center">
                                        <img src={candidate.image} alt={candidate.name} className="w-10 h-auto mr-2 rounded-md" />
                                        <div>
                                            <p className="text-gray-700">{candidate.name}</p>
                                            <p className="text-base">Votes: {totalVotes}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={`mt-2 px-4 py-2 ${hasVoted ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded hover:scale-110 transition-all duration-300`}
                                    onClick={() => !hasVoted && openModal(candidate)}
                                    disabled={hasVoted}
                                >
                                    Vote
                                </button>
                            </li>
                        )
                    })}
                </ul>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96 h-auto mx-auto">
                            <h2 className="text-xl mb-4 text-center font-semibold">Confirm Your Vote?</h2>
                            {selectedCandidate && (
                                <div className="text-center my-12">
                                    <div className="flex flex-col items-center justify-center mb-4">
                                        {selectedCandidate.partyImage && (
                                            <img
                                                src={selectedCandidate.partyImage}
                                                alt={selectedCandidate.party.name}
                                                className="w-36 h-auto rounded-md mr-4"
                                            />
                                        )}
                                        <h3 className="lg:text-xl text-lg font-semibold mt-4">{selectedCandidate.party.name}</h3>
                                        <h3 className="lg:text-lg text-base mt-4">Candidate: {selectedCandidate.name}</h3>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between mt-6">
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                                    onClick={submitVote}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
