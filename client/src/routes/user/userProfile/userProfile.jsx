import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../../context/toast";
import Footer from "../../../components/user/footer/footer";

export default function UserProfile() {
    const toast = useToast();

    const [user, setUser] = useState({
        email: "Unknown",
        voterIdCardNumber: "Unknown",
        role: "Unknown",
        createdAt: "Unknown",
        updatedAt: "Unknown",
        voterIdCardPicture: null
    });

    const [voteHistory, setVoteHistory] = useState([]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/get-loggedIn-user", { withCredentials: true });
            setUser(response.data.user);
        } catch (err) {
            toast.error("Please log in to see your profile.");
        }
    };

    const fetchVoteHistory = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/get-voted-details", { withCredentials: true });

            if (response.data) {
                const voteDetails = response.data.map((vote) => {
                    const { parsedVoteData, event, candidate, party } = vote;

                    return {
                        eventName: event ? event.name : 'Unknown',
                        candidateName: candidate ? candidate.name : 'Unknown',
                        candidateImageUrl: candidate ? candidate.imageUrl : 'Unknown',
                        partyName: party ? party.name : 'Unknown',
                        partyImageUrl: party ? party.imageUrl : 'Unknown',
                        timestamp: parsedVoteData && parsedVoteData.timestamp
                            ? new Date(parsedVoteData.timestamp).toLocaleDateString()
                            : 'Unknown',
                        status: "Voted",
                    };
                });

                setVoteHistory(voteDetails);
            } else {
                console.error("No valid data found in response:", response.data);
            }
        } catch (err) {
            console.error("Error fetching vote history:", err);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchVoteHistory();
    }, [toast]);

    return (
        <div className="w-full h-full lg:mt-12 mt-8">
            <div className="w-full h-full lg:px-28 px-4">
                <h2 className="lg:text-3xl text-xl font-extrabold lg:mb-12 mb-8">User Profile</h2>
                <div className="space-y-6">
                    <div className="mt-4">
                        <p className="block mb-1 lg:text-xl text-base">Voter ID Card Picture:</p>
                        {user.voterIdCardPicture ? (
                            <img
                                src={user.voterIdCardPicture}
                                alt="Voter ID Card"
                                className="mt-2 w-72 h-auto rounded-lg border-2 border-blue-500 shadow-md"
                            />
                        ) : (
                            <p className="text-gray-500 mt-2">No picture available</p>
                        )}
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 lg:text-xl text-lg">
                        <span>Email:</span>
                        <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 lg:text-lg text-base">
                        <span>Voter ID Card Number:</span>
                        <span>{user.voterIdCardNumber}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 lg:text-lg text-base">
                        <span>Account Created:</span>
                        <span>{user.createdAt !== "Unknown" ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 lg:text-lg text-base">
                        <span>Account Updated:</span>
                        <span>{user.updatedAt !== "Unknown" ? new Date(user.updatedAt).toLocaleDateString() : "Unknown"}</span>
                    </div>
                </div>
                <div className="relative bottom-0 -z-10">
                    <p className="text-gray-600 lg:text-lg text-md py-8">
                        This profile contains essential information about your voting credentials. If you notice any unexpected differences, please contact support.<br />
                        <span className="text-red-500">Note: Regarding changing your Voter ID Card Picture: please reach out to us through the contact us page.</span>
                    </p>
                </div>

                <div className="mt-8">
                    <h2 className="lg:text-3xl text-xl font-extrabold lg:mb-12 mb-8">Voting History</h2>
                    {voteHistory.length > 0 ? (
                        <div className="w-full xl:max-h-[20vw] h-72 overflow-y-auto mx-2">
                            {voteHistory.slice().reverse().map((vote, index) => (
                                <div key={index} className="p-3 border border-gray-300 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center justify-between xl:text-xl">
                                            <div className="flex flex-col">
                                                <p className="font-semibold">Vote Date:</p>
                                                <span className="text-gray-600">{vote.timestamp}</span>
                                            </div>
                                            <div className="flex flex-col text-center">
                                                <p className="font-semibold">Event:</p>
                                                <span className="text-gray-800">{vote.eventName}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-semibold">Status:</p>
                                                <span className="text-gray-800">{vote.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center items-center xl:text-xl mt-2 xl:space-x-32 space-x-10">
                                        <div className="flex flex-col items-center">
                                            <p className="font-semibold">Party:</p>
                                            <span className="text-gray-600">{vote.partyName}</span>
                                            <img src={vote.partyImageUrl} alt={vote.partyName} className="mt-2 w-24 h-auto object-cover" />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="font-semibold">Candidate:</p>
                                            <span className="text-gray-600">{vote.candidateName}</span>
                                            <img src={vote.candidateImageUrl} alt={vote.candidateName} className="mt-2 w-24 h-auto object-cover" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-md py-8 text-center">No voting history available. You have not participated in any voting event.</p>
                    )}
                </div>

            </div>
            <Footer />
        </div>
    );
}
