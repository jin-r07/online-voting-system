import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-white border-t-[1px] border-[#9BF00B] py-4 mt-16 w-full h-fit lg:px-28 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0 md:text-left text-center">
                    <h4 className="text-lg">Electronic Voting System (EVS)</h4>
                    <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>
                <div className="flex flex-col md:flex-row items-center text-base">
                    <Link to="/privacy-policy" className="mx-4 hover:underline">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="mx-3 hover:underline">Terms of Service</Link>
                    <Link to="/contact" className="mx-4 hover:underline">Contact Us</Link>
                </div>
                <div className="flex mt-4 md:mt-0">
                    <a href="https://www.facebook.com/JaeJin2003/" target="_blank" rel="noopener noreferrer" className="mx-2 text-[1.4rem] hover:text-[#0866FF]">
                        <FaFacebookSquare />
                    </a>
                    <a href="https://x.com/John0707Rai" target="_blank" rel="noopener noreferrer" className="mx-2 text-xl">
                        <BsTwitterX />
                    </a>
                    <a href="https://www.linkedin.com/in/john-hang-rai-b844a7266/" target="_blank" rel="noopener noreferrer" className="mx-2 text-[1.4rem] hover:text-blue-600">
                        <FaLinkedin />
                    </a>
                </div>
            </div>
        </footer>
    );
}