import React from "react";

export default function ConfirmLogout({ onConfirm, onCancel }) {
    const handleConfirm = () => {
        onConfirm();
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white p-6 rounded-lg w-80">
                <h3 className="text-lg mb-4">Confirm Logout</h3>
                <p className="mb-4">Are you sure you want to log out?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Yes, Logout
                    </button>
                    <button
                        onClick={onCancel}
                        className="py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}