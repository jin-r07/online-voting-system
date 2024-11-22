import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaHistory, FaUserTie, FaAward, FaVoteYea } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";

export default function AdminNavbar() {
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      navigate("/admin");
    }
  };

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg">
      <div className="flex items-center justify-center py-6 bg-white">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-auto w-20"
        />
        <span className="ml-3 text-xl font-semibold text-black">Admin Panel</span>
      </div>

      <ul className="flex flex-col mt-10 p-4 space-y-6">
        <li>
          <Link
            to="/admin-dashboard"
            className={`flex items-center hover:bg-gray-700 p-3 rounded transition-colors ${location.pathname === '/admin-dashboard' ? 'bg-gray-700' : ''}`}
          >
            <FaHome className="mr-3" /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin-events"
            className={`flex items-center hover:bg-gray-700 p-3 rounded transition-colors ${location.pathname === '/admin-events' ? 'bg-gray-700' : ''}`}
          >
            <FaVoteYea className="mr-3" /> Events
          </Link>
        </li>
        <li>
          <Link
            to="/admin-parties"
            className={`flex items-center hover:bg-gray-700 p-3 rounded transition-colors ${location.pathname === '/admin-parties' ? 'bg-gray-700' : ''}`}
          >
            <FaAward className="mr-3" /> Parties
          </Link>
        </li>
        <li>
          <Link
            to="/admin-candidates"
            className={`flex items-center hover:bg-gray-700 p-3 rounded transition-colors ${location.pathname === '/admin-candidates' ? 'bg-gray-700' : ''}`}
          >
            <FaUserTie className="mr-3" /> Candidates
          </Link>
        </li>
        <li>
          <Link
            to="/admin-users"
            className={`flex items-center hover:bg-gray-700 p-3 rounded transition-colors ${location.pathname === '/admin-users' ? 'bg-gray-700' : ''}`}
          >
            <FaUsers className="mr-3" /> Users
          </Link>
        </li>
        <li>
          <Link
            to="/admin-history"
            className={`flex items-center hover:bg-gray-700 p-3 rounded transition-colors ${location.pathname === '/admin-history' ? 'bg-gray-700' : ''}`}
          >
            <FaHistory className="mr-3" /> History
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
          >
            <RiLogoutBoxFill className="mr-3" /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
