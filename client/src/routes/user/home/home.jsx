import React from "react";
import TopCandidates from "../../../components/user/topCandidates/topCandidates";
import Footer from "../../../components/user/footer/footer";
import { Link } from "react-router-dom";
import FAQ from "../../../components/user/faq/faq";

export default function Home() {
    return (
        <div className="w-full h-full">
            <div className="lg:px-28 px-4 pt-10">
                <h1 className="text-2xl font-bold mb-4">Welcome to the Electronic Voting System (EVS)</h1>
                <p className="text-xl">
                    Stay informed about the latest voting events and play an active role in shaping the future. Our platform is designed to provide a seamless and secure voting experience, empowering you to express your voice with confidence. Join us in making democracy accessible for everyone!
                </p>

                <h1 className="text-xl py-6 font-bold">Ongoing voting events,</h1>

                <TopCandidates />

                <div className="mb-6 lg:text-xl text-lg">
                    <h2 className="font-semibold mb-2 text-3xl">How to Vote</h2>
                    <p>Voting is an essential part of participating in democracy. Follow these simple steps to ensure your voice is heard:</p>
                    <ol className="list-disc list-inside space-y-4 pt-6">
                        <li>
                            <strong>Register to Vote:</strong> Ensure you are registered to vote. If you haven't registered yet, choose option Register in above navigation and fill out the necessary details and do make sure that the information that you provide are correct and accurate.
                        </li>
                        <li>
                            <strong>Know Your Voting Candidates:</strong> Familiarize yourself with the different voting candidates available, and finally you can choose any one of the candidate of the event to cast your vote.
                        </li>
                        <li>
                            <strong>Cast Your Vote:</strong> Simply cast your vote by click on the option for Vote of the respective candidate that you want to cast vote for.<br /><span className="text-red-500">Note: Only one vote is allowed per event. So make sure that you are voting the correct candidate.</span>
                        </li>
                        <li>
                            <strong>Stay Informed:</strong> After voting, keep yourself updated on election results within the Results section in navigation panel.
                        </li>
                    </ol>
                    <p className="pt-6">For further questionnaires you can also reach out to us through<Link to="/contact" className="text-blue-600 hover:underline">&nbsp;Contact&nbsp;</Link>page. Or, for other questionnaires you can check out below FAQ.</p>

                </div>

                <FAQ />

                <div className="w-full h-full lg:text-8xl text-5xl">
                    <div className="flex flex-col py-32">
                        <p>Stop waiting.</p>
                        <p>Start</p>
                        <p>eVote-ing.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
