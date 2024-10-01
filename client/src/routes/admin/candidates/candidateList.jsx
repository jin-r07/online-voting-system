import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CandidateForm from './CandidateForm'; // Ensure the path is correct

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]); // Initial state is an empty array
    const [editingCandidateId, setEditingCandidateId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // State to control the modal

    // Fetch candidates
    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api-admin/get-all-candidates'); // Updated API endpoint
            // Check if response data is an array
            if (Array.isArray(response.data)) {
                setCandidates(response.data);
            } else {
                console.error('Unexpected data structure:', response.data);
                setCandidates([]); // Set to empty array if data is not as expected
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
            setCandidates([]); // Ensure candidates is an empty array on error
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    // Handle candidate updated
    const handleCandidateUpdated = () => {
        fetchCandidates();
        setModalOpen(false); // Close modal after updating
        setEditingCandidateId(null);
    };

    const handleEdit = (candidate) => {
        setEditingCandidateId(candidate._id);
        setModalOpen(true); // Open modal for editing
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api-admin/delete-candidate/${id}`); // Updated API endpoint
            fetchCandidates();
        } catch (error) {
            console.error('Error deleting candidate:', error);
        }
    };

    return (
        <div className="ml-64 p-8">
            <h1 className="text-2xl font-bold mb-4">Candidate List</h1>
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
                onClick={() => setModalOpen(true)}
            >
                Add Candidate
            </button>
            
            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingCandidateId ? 'Edit Candidate' : 'Add Candidate'}
                        </h2>
                        <CandidateForm 
                            candidateId={editingCandidateId} 
                            onCandidateUpdated={handleCandidateUpdated} 
                        />
                        <button
                            className="mt-4 text-red-500 hover:underline"
                            onClick={() => setModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Display message if no candidates */}
            {candidates.length === 0 ? (
                <p className="text-gray-500">No candidates available. Please add a candidate.</p>
            ) : (
                <ul>
                    {candidates.map((candidate) => (
                        <li key={candidate._id} className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded">
                            <div className="flex items-center">
                                <img src={candidate.image} alt={candidate.name} className="w-12 h-12 rounded-full mr-3" />
                                <span className="font-medium">{candidate.name}</span>
                            </div>
                            <div>
                                <button
                                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                                    onClick={() => handleEdit(candidate)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(candidate._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CandidateList;
