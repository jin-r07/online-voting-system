import React, { useEffect, useState } from "react";
import { FaUsers, FaUserTie, FaHistory, FaAward } from "react-icons/fa";
import axios from "axios";
import { useToast } from "../../../context/toast";

export default function Dashboard() {
  const { toast } = useToast();
  
  const [totalCandidates, setTotalCandidates] = useState("");

  const [totalCompletedEvents, setTotalCompletedEvents] = useState("");

  const [totalParties, setTotalParties] = useState("");

  const [totalUsers, setTotalUsers] = useState("");

  const fetchTotalCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-candidates-total");
      setTotalCandidates(response.data.totalCandidates);
    } catch (err) {
      toast.error("Error fetching candidates");
    }
  };

  const fetchTotalCompletedEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-completed-events-total");
      setTotalCompletedEvents(response.data.totalCompletedEvents);
    } catch (err) {
      toast.error("Error fetching candidates");
    }
  };

  const fetchTotalParties = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-parties-total");
      setTotalParties(response.data.totalParties);
    } catch (err) {
      toast.error("Error fetching candidates");
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-users-total");
      setTotalUsers(response.data.totalUsers);
    } catch (err) {
      toast.error("Error fetching candidates");
    }
  };

  useEffect(() => {
    fetchTotalCandidates();
    fetchTotalCompletedEvents();
    fetchTotalParties();
    fetchTotalUsers();
  }, []);


  return (
    <div className="ml-64 p-8 bg-gray-100 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg mt-2">Welcome to the electronic voting system. Manage events, parties, candidates, and users from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <FaAward className="text-3xl text-purple-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Parties</h2>
              <p className="text-gray-600">Total: {totalParties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <FaUserTie className="text-3xl text-blue-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Candidates</h2>
              <p className="text-gray-600">Total: {totalCandidates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <FaUsers className="text-3xl text-green-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-gray-600">Total: {totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <FaHistory className="text-3xl text-red-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">History</h2>
              <p className="text-gray-600">Total: {totalCompletedEvents}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}