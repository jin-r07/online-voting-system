import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaHistory, FaUserTie, FaAward, FaVoteYea } from 'react-icons/fa';

export default function AdminNavbar() {
  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 bg-white">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-auto w-20"
        />
        <span className="ml-3 text-xl font-semibold text-black">Admin Panel</span>
      </div>

      {/* Nav Links */}
      <ul className="flex flex-col mt-10 p-4 space-y-6">
        <li>
          <Link
            to="/admin-dashboard"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
          >
            <FaHome className="mr-3" /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin-create-events"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
          >
            <FaVoteYea className="mr-3" /> Create Events
          </Link>
        </li>
        <li>
          <Link
            to="/admin-candidates"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
          >
            <FaUserTie className="mr-3" /> Candidates
          </Link>
        </li>
        <li>
          <Link
            to="/admin-parties"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
          >
            <FaAward className="mr-3" /> Parties
          </Link>
        </li>
        <li>
          <Link
            to="/admin-users"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
          >
            <FaUsers className="mr-3" /> Users
          </Link>
        </li>
        <li>
          <Link
            to="/admin-history"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
          >
            <FaHistory className="mr-3" /> History
          </Link>
        </li>
      </ul>
    </nav>
  );
}
