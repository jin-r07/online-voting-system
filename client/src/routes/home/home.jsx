import React from "react";
import TopCandidates from "../../components/topCandidates/topCandidates";

export default function Home() {
    return (
        <div className="w-full h-full">
            <div className="lg:px-28 px-4 pt-10">
                <h1 className="text-2xl font-bold mb-4">Welcome to Electronic Voting System (EVS),</h1>

                <TopCandidates />

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Introduction to Voting</h2>
                    <p>Voting is a crucial part of democratic participation. Here, you can find information on how to
                        register, cast your vote, and stay informed about ongoing elections in Nepal.</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">How to Vote</h2>
                    <p>To vote, you need to register and be aware of the voting methods available. Check out our guide
                        for step-by-step instructions on voter registration and casting your vote.</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Eligibility Criteria</h2>
                    <p>To be eligible to vote, you must meet certain criteria. Make sure to review the requirements to
                        ensure you are eligible to participate in the elections.</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Educational Resources</h2>
                    <p>We provide resources to help you understand the voting process, including guides, tutorials, and
                        more. Stay informed and prepared.</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Updates and News</h2>
                    <p>Keep up-to-date with the latest news and updates related to elections. Stay informed about
                        changes and important announcements.</p>
                </div>

                <div className="mb-6">
                    <a href="/faq" className="text-blue-600 hover:underline">Frequently Asked Questions</a>
                </div>

                <div className="mb-6">
                    <a href="/contact" className="text-blue-600 hover:underline">Contact Information</a>
                </div>
            </div>
        </div>
    );
}
