import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PartyForm from './PartyForm'; // Ensure the path is correct

const PartyList = () => {
    const [parties, setParties] = useState([]);
    const [editingParty, setEditingParty] = useState(null); // Change state to store the entire party object
    const [modalOpen, setModalOpen] = useState(false);

    const fetchParties = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api-admin/get-all-parties');
            if (Array.isArray(response.data)) {
                setParties(response.data);
            } else {
                console.error('Unexpected data structure:', response.data);
                setParties([]);
            }
        } catch (error) {
            console.error('Error fetching parties:', error);
            setParties([]);
        }
    };

    useEffect(() => {
        fetchParties();
    }, []);

    const handlePartyUpdated = () => {
        fetchParties();
        setModalOpen(false);
        setEditingParty(null); // Reset the editing party when a party is updated
    };

    const handleEdit = (party) => {
        setEditingParty(party); // Store the entire party object
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        // Add confirmation before deleting
        const confirmed = window.confirm('Are you sure you want to delete this party?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8080/api-admin/delete-party/${id}`);
                fetchParties();
            } catch (error) {
                console.error('Error deleting party:', error);
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingParty(null); // Reset editing party when closing the modal
    };

    return (
        <div className="ml-64">
            <div className="sticky top-0 left-0 bg-white z-50 shadow-md px-8 py-2">
                <h1 className="text-3xl font-bold my-4">Party List</h1>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4 transition duration-200"
                    onClick={() => {
                        setModalOpen(true);
                        setEditingParty(null); // Ensure we're in "Add" mode
                    }}
                >
                    Add Party
                </button>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingParty ? 'Edit Party' : 'Add Party'}
                        </h2>
                        <PartyForm
                            party={editingParty} // Pass the entire party object
                            onPartyUpdated={handlePartyUpdated}
                        />
                        <button
                            className="mt-4 text-red-500 hover:underline"
                            onClick={closeModal} // Use the closeModal function here
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Display message if no parties */}
            {parties.length === 0 ? (
                <p className="text-gray-500 pl-8">No parties available. Please add a party.</p>
            ) : (
                <ul className="space-y-4 px-8">
                    {parties.map((party) => (
                        <li key={party._id} className="flex items-center justify-between bg-white p-4 shadow rounded">
                            <div className="flex items-center">
                                {party.image && (
                                    <img
                                        src={`http://localhost:8080/uploads/parties/${party.image}`}
                                        alt={party.name}
                                        className="w-14 h-14 rounded-full border border-gray-300 mr-3"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }} // Placeholder on error
                                    />
                                )}
                                <span className="text-lg">{party.name}</span>
                            </div>
                            <div className="space-x-2">
                                <button
                                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-200"
                                    onClick={() => handleEdit(party)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                                    onClick={() => handleDelete(party._id)}
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

export default PartyList;
