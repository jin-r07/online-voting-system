import React from "react";

export default function Footer() {
    return (
        <footer className="bg-[#111827] text-gray-200 py-4 pr-8">
            <div className="text-right text-sm">
                <p>&copy; {new Date().getFullYear()}, Electronic Voting System (EVS).</p>
                <p>All rights reserved.</p>
            </div>
        </footer>
    );
}
