import React from "react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-10 w-full h-full lg:px-28 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h4 className="text-lg">Electronic Voting System (EVS)</h4>
                    <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>
                <div className="flex flex-col md:flex-row items-center text-base">
                    <Link to="/privacy-policy" className="mx-2 hover:underline">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="mx-2 hover:underline">Terms of Service</Link>
                    <Link to="/contact" className="mx-2 hover:underline">Contact Us</Link>
                </div>
                <div className="flex mt-4 md:mt-0">
                    <a href="https://www.facebook.com/JaeJin2003/" target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-blue-500">
                        <FaFacebook />
                    </a>
                    <a href="https://x.com/John0707Rai" target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-blue-400">
                        <BsTwitterX />
                    </a>
                    <a href="https://www.linkedin.com/in/john-hang-rai-b844a7266/" target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-blue-600">
                        <FaLinkedin />
                    </a>
                </div>
            </div>
        </footer>
    );
}