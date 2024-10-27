import React, { useState } from "react";
import axios from "axios";

export default function UserSettings() {
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmation, setConfirmation] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const handleUpdateEmail = async () => {
        try {
            const response = await axios.put("http://localhost:8080/api/update-email", { email });
            setMessage(response.data.message);
            setError("");
        } catch (err) {
            setError("Error updating email. Please try again.");
            setMessage("");
        }
    };

    const handleUpdatePassword = async () => {
        if (password !== confirmation) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.put("http://localhost:8080/api/update-password", { password });
            setMessage(response.data.message);
            setError("");
        } catch (err) {
            setError("Error updating password. Please try again.");
            setMessage("");
        }
    };

    const handleDeleteAccount = async () => {
        // Add logic for deleting account
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                const response = await axios.delete("http://localhost:8080/api/delete-account");
                setMessage(response.data.message);
                setError("");
            } catch (err) {
                setError("Error deleting account. Please try again.");
                setMessage("");
            }
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-center lg:mt-12 mt-8">
            <div className="w-full lg:px-28 px-4 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">User Settings</h2>

                {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="space-y-6">
                    <div>
                        <label className="block mb-1 text-lg font-medium">Update Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter new email"
                        />
                        <button
                            onClick={handleUpdateEmail}
                            className="mt-2 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Update Email
                        </button>
                    </div>

                    <div>
                        <label className="block mb-1 text-lg font-medium">Update Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter new password"
                        />
                        <input
                            type="password"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                            placeholder="Confirm new password"
                        />
                        <button
                            onClick={handleUpdatePassword}
                            className="mt-2 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Update Password
                        </button>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
