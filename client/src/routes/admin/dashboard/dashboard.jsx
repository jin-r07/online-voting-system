import React, { useEffect, useState } from "react";
import { FaUsers, FaUserTie, FaHistory, FaAward } from "react-icons/fa";
import axios from "axios";
import { useToast } from "../../../context/toast";
import { calculatePageRank } from "../../../utils/pageRank";

export default function Dashboard() {
  const { toast } = useToast();

  const [totalCandidates, setTotalCandidates] = useState("");

  const [totalCompletedEvents, setTotalCompletedEvents] = useState("");

  const [totalParties, setTotalParties] = useState("");

  const [totalUsers, setTotalUsers] = useState("");

  const [pageRankScores, setPageRankScores] = useState({ scores: {}, details: {} });

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

  const fetchActiveEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-events");
      return response.data;
    } catch (err) {
      toast.error("Error fetching active events");
      return [];
    }
  };

  const extractVoteData = async (activeEvents) => {
    const votesCount = {};
    const candidateDetails = {};

    for (const event of activeEvents) {
      try {
        const response = await axios.get(`http://localhost:8080/api/get-vote-data?eventId=${event._id}`);
        const allVotes = response.data;

        for (const [candidateId, count] of Object.entries(allVotes)) {
          if (!votesCount[candidateId]) {
            votesCount[candidateId] = 0;
          }
          votesCount[candidateId] += count;

          const candidate = event.candidates.find(c => c._id === candidateId);
          if (candidate) {
            candidateDetails[candidateId] = {
              name: candidate.name,
              image: candidate.image,
              partyName: candidate.partyName,
              partyImage: candidate.partyImage,
              eventName: event.eventName,
            };
          }
        }
      } catch (err) {
        toast.error(`Error fetching votes for event ${event._id}`);
      }
    }

    const scores = calculatePageRank(votesCount);
    const combinedScores = Object.entries(scores).reduce((acc, [candidateId, score]) => {
      acc[candidateId] = {
        score,
        details: candidateDetails[candidateId],
      };
      return acc;
    }, {});

    setPageRankScores({ scores: combinedScores });
  };


  useEffect(() => {
    const loadData = async () => {
      await fetchTotalCandidates();
      await fetchTotalCompletedEvents();
      await fetchTotalParties();
      await fetchTotalUsers();

      const activeEvents = await fetchActiveEvents();
      await extractVoteData(activeEvents);
    };

    loadData();
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

      <div className="mt-10">
        <h2 className="text-2xl font-bold">PageRank Scores</h2>
        <ul>
          {Object.entries(pageRankScores.scores).map(([candidateId, { score, details }]) => (
            <li key={candidateId} className="flex items-center mt-2">
              <img
                src={details?.image}
                alt={details?.name}
                className="w-12 h-12 rounded-full mr-2"
              />
              <div>
                <p className="font-medium">{details?.name}</p>
                <p className="text-gray-600">{details?.partyName}</p>
                <img
                  src={details.partyImage}
                  alt={details.partyName}
                  className="w-8 h-8 rounded-full"
                />
                <p className="text-gray-600">Event: {details?.eventName}</p>
                <p className="text-gray-600">Score: {score.toFixed(4)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
