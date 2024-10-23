import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
    {
        question: "What is an electronic voting system?",
        answer: "An electronic voting system allows voters to cast their votes using electronic devices such as computers, tablets, or voting machines. This system aims to enhance the voting process by making it faster, more secure, and more accessible."
    },
    {
        question: "How can I register to vote?",
        answer: "To register to vote in Nepal, you need to have your voter card. You can create one by visiting your local Election Commission office and providing necessary documents, including proof of identity and citizenship. You can also check the official Election Commission Nepal website for the latest registration guidelines. And simply fill out the necessary details within the form of the Register option within the navigation panel. Make sure that the information provided is accurate and correct."
    },
    {
        question: "What are the eligibility criteria for voting in Nepal?",
        answer: "To be eligible to vote in Nepal, you must be a Nepali citizen, at least 18 years old, and have a valid citizenship certificate. Ensure you are registered in the voter list before the election."
    },
    {
        question: "How does the electronic voting process work?",
        answer: "Voters log into the system using secure credentials, select their preferred candidates or options, and submit their votes electronically. Each vote is recorded securely to ensure confidentiality and integrity."
    },
    {
        question: "Is my vote confidential?",
        answer: "Yes, all votes cast through our electronic voting system are confidential."
    },
    {
        question: "What if I encounter technical issues while voting?",
        answer: "If you experience any technical issues, please contact our support team immediately through the contact option on our website. We are available to assist you throughout the voting process."
    },
    {
        question: "Can I vote from anywhere?",
        answer: "Yes, our electronic voting system is designed to be accessible from any location with internet connectivity, allowing you to vote conveniently."
    },
    {
        question: "What if I change my mind after submitting my vote?",
        answer: "Once your vote is submitted, it cannot be changed to ensure the integrity of the voting process. Please review your selections carefully before submitting."
    },
    {
        question: "Is there a cost associated with voting?",
        answer: "Voting through our electronic system is completely free of charge. There are no hidden fees or costs associated with the voting process."
    },
    {
        question: "Who can participate in the voting?",
        answer: "Eligibility to vote is determined by the specific rules set for each election. Generally, only registered voters or eligible participants can cast their votes through the electronic voting system."
    },
    {
        question: "What should I do if I forget my login credentials?",
        answer: "If you forget your login credentials, use the “Forgot Password” option on the login page. You will receive instructions on how to reset your password via your registered email."
    }
];

export default function FAQ() {
    const [openIndexes, setOpenIndexes] = useState([]);

    const handleToggle = index => {
        setOpenIndexes(prevIndexes =>
            prevIndexes.includes(index)
                ? prevIndexes.filter(i => i !== index)
                : [...prevIndexes, index]
        );
    };

    return (
        <>
            <div className="w-full h-full pt-10 pb-4">
                <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQs)</h1>
                <p className="text-xl border-b border-gray-300 pb-4">Have question? Below you'll find answers to the most common questions you may have.</p>
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-300 mb-4 cursor-pointer" onClick={() => handleToggle(index)}>
                        <div className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-100">
                            <h2 className="lg:text-xl text-lg">{faq.question}</h2>
                            <span className="text-lg font-bold">{openIndexes.includes(index) ? '-' : '+'}</span>
                        </div>
                        {openIndexes.includes(index) && (
                            <div className="p-4 lg:text-lg text-base">
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
                <p className="mt-6 lg:text-lg text-base">
                    If you have any further questions that are not answered here, please feel free to 
                    <Link to="/contact" className="text-blue-500 hover:underline"> Contact us</Link>.
                </p>
            </div>
        </>
    );
}
