import React from "react";

export default function TopCandidates() {
    const voteEvents = [
        {
            eventName: 'Event 1',
            candidates: [
                {
                    id: 1,
                    name: 'John Doe',
                    votes: 1500,
                    image: 'https://via.placeholder.com/100?text=John+Doe'
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    votes: 1200,
                    image: 'https://via.placeholder.com/100?text=Jane+Smith'
                },
                {
                    id: 3,
                    name: 'Emily Johnson',
                    votes: 900,
                    image: 'https://via.placeholder.com/100?text=Emily+Johnson'
                }
            ]
        },
        {
            eventName: 'Event 2',
            candidates: [
                {
                    id: 4,
                    name: 'Michael Brown',
                    votes: 1800,
                    image: 'https://via.placeholder.com/100?text=Michael+Brown'
                },
                {
                    id: 5,
                    name: 'Sarah Davis',
                    votes: 1400,
                    image: 'https://via.placeholder.com/100?text=Sarah+Davis'
                },
                {
                    id: 6,
                    name: 'David Wilson',
                    votes: 1300,
                    image: 'https://via.placeholder.com/100?text=David+Wilson'
                }
            ]
        },
        {
            eventName: 'Event 3',
            candidates: [
                {
                    id: 7,
                    name: 'Jessica Taylor',
                    votes: 2000,
                    image: 'https://via.placeholder.com/100?text=Jessica+Taylor'
                },
                {
                    id: 8,
                    name: 'Paul Martinez',
                    votes: 1600,
                    image: 'https://via.placeholder.com/100?text=Paul+Martinez'
                },
                {
                    id: 9,
                    name: 'Laura Garcia',
                    votes: 1500,
                    image: 'https://via.placeholder.com/100?text=Laura+Garcia'
                }
            ]
        }
    ];

    const noData = !voteEvents.length;

    return (
        <div className="mb-6">
            {noData ? (
                <div className="text-center py-10">
                    <p className="text-xl">No events available at the moment.</p>
                    <p>Please check back later for updates on upcoming vote events.</p>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Top Candidates</h2>
                    <div className="flex flex-wrap -mx-4">
                        {voteEvents.map((event, index) => (
                            <div key={index} className="w-full md:w-1/2 px-4 mb-10">
                                <h3 className="text-lg font-medium mb-4">{event.eventName}</h3>
                                <div className="space-y-6">
                                    {event.candidates.map((candidate, idx) => (
                                        <div key={candidate.id}
                                            className="flex items-center p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                                            <img src={candidate.image} alt={candidate.name}
                                                className="w-20 h-20 rounded-full border-2 border-gray-300" />
                                            <div className="ml-4">
                                                <p className="text-lg font-semibold text-gray-800">{candidate.name}</p>
                                                <p className="text-sm text-gray-500">Votes: {candidate.votes}</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="text-sm text-gray-400">Rank: {idx + 1}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}