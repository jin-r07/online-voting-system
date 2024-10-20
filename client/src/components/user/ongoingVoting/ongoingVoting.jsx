import React, { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OngoingVoting() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const [ongoingEvents, setOngoingEvents] = useState([]);

    const fetchOngoingEvents = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api-admin/get-events");
            setOngoingEvents(response.data);
        } catch (err) {
            toast.error("Error fetching candidates", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    useEffect(() => {
        fetchOngoingEvents();
    }, []);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? ongoingEvents.length - 1 : prevIndex - 1
        );
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === ongoingEvents.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNextClick();
        }, 5000);

        return () => clearInterval(interval);
    }, [ongoingEvents]);

    return (
        <div className="w-full h-full bg-[#9BF00B] lg:px-28 px-2 py-4 text-center lg:text-lg tracking-wide">
            {ongoingEvents.length === 0 ? (
                <p>No active voting events available at the moment.</p>
            ) : ongoingEvents.length === 1 ? (
                <p>{ongoingEvents[0].eventName}</p>
            ) : (
                <>
                    <div className="slider-container overflow-hidden relative">
                        <div
                            className="slider flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {ongoingEvents.map((item, index) => (
                                <div key={index} className="slide flex-shrink-0 w-full">
                                    <p>{item.eventName}</p>
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
            <ToastContainer />
        </div>
    );
}
