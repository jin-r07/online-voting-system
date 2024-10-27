import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../../context/toast";
import Footer from "../../../components/user/footer/footer";
import { useNavigate } from "react-router-dom";

export default function UserSettings() {
    const toast = useToast();

    const [email, setEmail] = useState("");

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/get-loggedIn-user", { withCredentials: true });
                setEmail(response.data.user.email);
                setUser(response.data.user);
            } catch (err) {
                toast.error("Please log in with your account.");
            }
        };

        fetchUserEmail();
    }, [toast]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailUpdate = async () => {
        if (!user) {
            toast.error("User information is not available.");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api-admin/edit-user-email/${user._id}`, { email }, { withCredentials: true });
            toast.success("Email updated successfully!");
        } catch (err) {
            toast.error("Error updating email.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        try {
            await axios.delete(`http://localhost:8080/api-admin/delete-user/${user._id}`, { withCredentials: true });
            toast.success("Account deleted successfully!");
            navigate("/");
            window.location.reload();
        } catch (err) {
            toast.error("Error deleting account.");
        }
    };

    return (
        <div className="w-full h-screen lg:mt-12 mt-8">
            <div className="w-full h-full lg:px-28 px-4">
                <h2 className="lg:text-3xl text-xl font-extrabold lg:mb-12 mb-8">User Settings</h2>

                <div className="space-y-6">
                    <div className="border-[1px] border-gray-300 p-4 rounded-md">
                        <h3 className="text-xl font-semibold mb-4">Edit Email</h3>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="border p-2 rounded-lg w-full lg:text-lg text-base"
                            placeholder="Enter your email"
                        />
                        <button
                            onClick={handleEmailUpdate}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
                        >
                            Update Email
                        </button>
                    </div>

                    <div className="border-[1px] border-gray-300  p-4 rounded-md">
                        <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
                        <p className="text-red-600 mb-2 lg:text-lg text-base">
                            Warning: Deleting your account is irreversible. Your account will be permanently lost.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
