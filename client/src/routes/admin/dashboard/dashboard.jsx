import React from "react";
import { FaUsers, FaUserTie, FaHistory, FaAward } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="ml-64 p-8 bg-gray-100 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the electronic voting system. Manage candidates, users, events, and history from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <FaUserTie className="text-3xl text-blue-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Candidates</h2>
              <p className="text-gray-600">Manage all candidates</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <FaAward className="text-3xl text-purple-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Parties</h2>
              <p className="text-gray-600">Upcoming voting events</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <FaUsers className="text-3xl text-green-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-gray-600">Manage registered users</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <FaHistory className="text-3xl text-red-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">History</h2>
              <p className="text-gray-600">View voting history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
