import React, { useState } from "react";

const faqs = [
    {
        question: "How can I register to vote in Nepal?",
        answer: "To register to vote in Nepal, you need to visit your local Election Commission office and provide necessary documents, including proof of identity and citizenship. You can also check the official Election Commission Nepal website for the latest registration guidelines."
    },
    {
        question: "What are the eligibility criteria for voting in Nepal?",
        answer: "To be eligible to vote in Nepal, you must be a Nepali citizen, at least 18 years old, and have a valid citizenship certificate. Ensure you are registered in the voter list before the election."
    },
    {
        question: "Where can I find my polling station?",
        answer: "Your polling station will be assigned based on your residence. You can find your designated polling station by checking the Election Commission Nepal's official website or contacting your local election office."
    },
    {
        question: "What should I bring to the polling station on election day?",
        answer: "On election day, bring your citizenship certificate and any other required identification documents as specified by the Election Commission. It's also a good idea to bring a pen or pencil, as some stations may not provide writing instruments."
    },
    {
        question: "How can I verify my voter registration status?",
        answer: "You can verify your voter registration status by visiting the Election Commission Nepal's website or contacting your local election office. They can provide information on whether you are registered and if your details are up to date."
    },
    {
        question: "What if I lost my citizenship certificate?",
        answer: "If you have lost your citizenship certificate, you need to file a report at the local police station and then apply for a replacement through the District Administration Office or the Election Commission Nepal."
    },
    {
        question: "Can I vote if I am abroad?",
        answer: "Nepali citizens residing abroad can vote if they are registered in the voter list and fulfill the criteria set by the Election Commission. You may need to participate in special voting arrangements or consular voting."
    },
    {
        question: "What is the process for voting by proxy?",
        answer: "Voting by proxy is allowed in certain circumstances. You need to apply for a proxy vote through the Election Commission Nepal and provide valid reasons and documentation. The proxy must be a registered voter."
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
        <div className="w-full lg:px-28 px-4 pt-10">
            <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
            {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-300 mb-4 cursor-pointer" onClick={() => handleToggle(index)}>
                    <div className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-100">
                        <h2 className="text-xl font-semibold">{faq.question}</h2>
                        <span className="text-lg font-bold">{openIndexes.includes(index) ? '-' : '+'}</span>
                    </div>
                    {openIndexes.includes(index) && (
                        <div className="p-4">
                            <p>{faq.answer}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
