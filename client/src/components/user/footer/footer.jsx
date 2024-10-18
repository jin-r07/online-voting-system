import React from 'react';
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { BsTwitterX } from "react-icons/bs";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-10 w-full h-full lg:px-28 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h4 className="text-lg">Electronic Voting System (EVS)</h4>
                    <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>
                <div className="flex flex-col md:flex-row items-center text-base">
                    <a href="/privacy-policy" className="mx-2 hover:underline">Privacy Policy</a>
                    <a href="/terms-of-service" className="mx-2 hover:underline">Terms of Service</a>
                    <a href="/contact" className="mx-2 hover:underline">Contact Us</a>
                </div>
                <div className="flex mt-4 md:mt-0">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-blue-500">
                        <FaFacebook />
                    </a>
                    <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-blue-400">
                        <BsTwitterX />
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-blue-600">
                        <FaLinkedin />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-pink-500">
                        <FaInstagram />
                    </a>
                </div>
            </div>
        </footer>
    );
}