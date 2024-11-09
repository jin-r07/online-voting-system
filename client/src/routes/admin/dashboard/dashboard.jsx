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

  const [voteLogs, setVoteLogs] = useState([]);

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

  const fetchVoteLogs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-allVote-logs");
      setVoteLogs(response.data);
    } catch (err) {
      toast.error("Error fetching votes for event", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTotalCandidates();
      await fetchTotalCompletedEvents();
      await fetchTotalParties();
      await fetchTotalUsers();
      await fetchVoteLogs();

      const activeEvents = await fetchActiveEvents();
      await extractVoteData(activeEvents);
    };

    loadData();
  }, []);

  const groupedByEvent = Object.entries(pageRankScores.scores).reduce((acc, [candidateId, { score, details }]) => {
    if (!acc[details.eventName]) {
      acc[details.eventName] = [];
    }
    acc[details.eventName].push({ candidateId, score, details });
    return acc;
  }, {});

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

      <div className="w-full h-[25vh] mt-10">
        <h2 className="text-2xl font-bold mb-5">Vote Logs:</h2>
        {voteLogs.length > 0 ? (
          voteLogs.map((log) => (
            <div key={log._id} className="p-4 border border-gray-300 rounded-md">
              <p><strong>Id:</strong> {log._id}</p>
              <p><strong>Event Id:</strong> {log.eventId}</p>
              <p><strong>Candidate Id:</strong> {log.candidateId}</p>
              <p><strong>Voter Id Card Number:</strong> {log.voterId}</p>
              <p><strong>Block Mined:</strong> {log.blockHash} with index: {log.blockIndex}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center mt-4 text-lg">No vote logs available at the moment.</p>
        )}
      </div>

      <div className="w-full h-fit mt-10">
        <h2 className="text-2xl font-bold">Active Events Candidates Rank Scores:</h2>
        {Object.keys(groupedByEvent).length > 0 ? (
          Object.entries(groupedByEvent).map(([eventName, candidates]) => (
            <div key={eventName} className="w-full max-h-64 overflow-y-auto flex flex-col mt-6 border-[1px] border-gray-300 px-4 rounded-md shadow-lg">
              <h3 className="sticky top-0 bg-white text-xl font-semibold p-4">{eventName}</h3>
              {candidates
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map(({ candidateId, score, details }) => (
                  <div key={candidateId} className="flex items-center justify-between p-4 border-[1px] border-gray-200 rounded-md mb-2">
                    <div className="flex items-center">
                      <img src={details.partyImage} alt={details.partyName} className="w-16 h-auto rounded-sm mr-4" />
                      <div className="flex flex-col">
                        <p className="text-xl">{details.partyName}</p>
                        <p>Score: {score.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <img src={details.image} alt={details.name} className="w-10 h-auto mr-2" />
                      <div className="flex flex-col">
                        <p className="text-gray-600">Candidate:</p>
                        <p className="font-medium">{details.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center mt-4 text-lg">No active events or data available at the moment.</p>
        )}
      </div>
    </div>
  );
}
