import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import Footer from "../../../components/user/footer/footer";
import { formatDate } from "../../../utils/formatDate&Time";
import { useToast } from "../../../context/toast";

export default function ResultsPage() {
    const toast = useToast();

    const { eventId } = useParams();

    const [eventData, setEventData] = useState(null);

    const [votesData, setVotesData] = useState({});

    const fetchEventData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api-admin/get-events-completed/${eventId}`);
            setEventData(response.data);

            const votesResponse = await axios.get("http://localhost:8080/api/get-vote-data", {
                params: { eventId },
                withCredentials: true,
            });
            setVotesData(votesResponse.data);
        } catch (err) {
            toast.error("Error fetching event details");
        }
    };

    useEffect(() => {
        fetchEventData();
    }, [eventId]);

    if (!eventData) {
        return <div className="text-center text-xl py-10">Loading...</div>;
    }

    const startDate = formatDate(eventData.start);
    const endDate = formatDate(eventData.end);

    const sortedCandidates = eventData.candidates.sort((a, b) => {
        const votesA = votesData[a._id] || 0;
        const votesB = votesData[b._id] || 0;
        return votesB - votesA;
    });

    return (
        <>
            <div className="mb-8 lg:px-28 px-4 pt-10 bg-gray-50 w-full h-full">
                <h2 className="xl:text-3xl text-2xl font-bold mb-6 text-gray-800">{eventData.eventName}</h2>
                <div className="mb-6 text-gray-700 xl:text-lg text-base">
                    <p><strong>Status:&nbsp;</strong><span>{capitalizeFirstLetter(eventData.status)}</span></p>
                    <p><strong>Start Date:&nbsp;</strong><span>{startDate}</span></p>
                    <p><strong>End Date:&nbsp;</strong><span>{endDate}</span></p>
                </div>

                <h2 className="text-2xl font-semibold my-6 text-gray-800">Candidates</h2>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCandidates.map((candidate) => {
                        const totalVotes = votesData[candidate._id] || 0;
                        return (
                            <li
                                key={candidate._id}
                                className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl border-[1px] border-gray-300 transition-shadow duration-300"
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={candidate.partyImage}
                                        alt={candidate.party.name}
                                        className="w-24 h-auto object-cover rounded-sm mr-4"
                                    />
                                    <h3 className="text-xl font-bold text-gray-800">{candidate.party.name}</h3>
                                </div>
                                <div className="flex items-center">
                                    <img
                                        src={candidate.image}
                                        alt={candidate.name}
                                        className="w-12 h-auto rounded-md mr-3"
                                    />
                                    <div className="flex-1">
                                        <p className="text-lg text-gray-700 font-semibold">{candidate.name}</p>
                                        <p className="text-base text-gray-600"><strong>Votes:</strong> {totalVotes}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <Footer />
        </>
    );
}
