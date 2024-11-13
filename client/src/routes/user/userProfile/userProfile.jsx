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

    useEffect(() => {
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
                const response = await axios.get("http://localhost:8080/api/voted-details", { withCredentials: true });
                setVoteHistory(response.data);
            } catch (err) {
            }
        };

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
                        <span className="text-red-500">Note: Regarding changing your Voter ID Card Picture: please reach out to us through contact us page.</span>
                    </p>
                </div>

                {/* Vote History Section */}
                <div className="mt-8">
                    <h2 className="lg:text-3xl text-xl font-extrabold">Voting History</h2>
                    {voteHistory.length > 0 ? (
                        <ul className="space-y-4 mt-4">
                            {voteHistory.map((vote, index) => (
                                <li key={index} className="border-b pb-2">
                                    <p className="font-semibold">{vote.candidateId}</p>
                                    <p>Event ID: {vote.eventId}</p>
                                    <p>Vote Date: {new Date(vote.timestamp).toLocaleDateString()}</p>
                                    <p>Status: {vote.status || "Voted"}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 lg:text-lg text-md py-8">No voting history available. You have not taken part in any voting event.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
