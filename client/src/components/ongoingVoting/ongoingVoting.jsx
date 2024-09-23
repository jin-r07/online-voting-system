import React, { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

export default function OngoingVoting() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const votingData = [
        { title: "Ongoing Vote 1" },
        { title: "Ongoing Vote 2" },
        { title: "Ongoing Vote 3" },
    ];

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? votingData.length - 1 : prevIndex - 1
        );
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === votingData.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNextClick();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-[#9BF00B] lg:px-28 px-2 py-4 text-center lg:text-lg tracking-wide">
            {votingData.length === 0 ? (
                <p>No ongoing votes at the moment.</p>
            ) : votingData.length === 1 ? (
                <p>{votingData[0].title}</p>
            ) : (
                <>
                    <div className="slider-container overflow-hidden relative">
                        <div
                            className="slider flex transition-transform duration-500"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {votingData.map((item, index) => (
                                <div key={index} className="slide flex-shrink-0 w-full">
                                    <p>{item.title}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#9BF00B] hover:bg-black text-black hover:text-white p-1 transition-all rounded-md"
                            onClick={handlePrevClick}
                        >
                            <FaAngleLeft />
                        </button>
                        <button
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#9BF00B] hover:bg-black text-black hover:text-white p-1 transition-all rounded-md"
                            onClick={handleNextClick}
                        >
                            <FaAngleRight />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
