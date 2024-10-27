import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfile() {
    const [user, setUser] = useState({
        email: "Unknown",
        voterIdCardNumber: "Unknown",
        role: "Unknown",
        createdAt: "Unknown",
        voterIdCardPicture: null
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.post("http://localhost:8080/api/get-loggedIn-user", {}, { withCredentials: true });
                setUser(response.data.user);
            } catch (err) {
                setUser({
                    email: "Unknown",
                    voterIdCardNumber: "Unknown",
                    role: "Unknown",
                    createdAt: "Unknown",
                    voterIdCardPicture: null
                });
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="w-full h-full flex justify-center items-center lg:mt-12 mt-8">
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
                    <div className="flex justify-between items-center border-b pb-2 lg:text-lg text-base">
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
                </div>
            </div>
        </div>
    );
}
