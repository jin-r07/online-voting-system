import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { VscMenu } from "react-icons/vsc";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import LoginForm from "../login/login";
import RegisterForm from "../register/register";
import ForgotPasswordForm from "../forgotPassword/forgotPassword";
import OngoingVoting from "../ongoingVoting/ongoingVoting";
import Cookies from "js-cookie";
import axios from "axios";
import ConfirmLogout from "../logoutPopup/logoutPopup";
import { BiSolidUser } from "react-icons/bi";
import { RiSettings5Fill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const [activeForm, setActiveForm] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userData, setUserData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [showDropdown, setShowDropdown] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const dropdownRef = useRef(null);
    const navRef = useRef(null);
    const location = useLocation();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Vote", href: "/vote" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact", href: "/contact" }
    ];

    const fetchUserData = async () => {
        const token = Cookies.get("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/user-authenticated", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.data) {
                setIsLoggedIn(true);
                setUserData(response.data);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFormToggle = (form) => {
        setActiveForm(prevForm => prevForm === form ? null : form);
    };

    const handleLogout = async () => {
        setShowConfirmModal(true);
    };

    const confirmLogout = async () => {
        setShowConfirmModal(false);

        try {
            await axios.post("http://localhost:8080/api/user-logout", {}, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            Cookies.remove("token");
            Cookies.remove("userId");
            setIsLoggedIn(false);
            setUserData(null);
            window.location.reload();
        } catch (error) {
        }
    };

    const cancelLogout = () => {
        setShowConfirmModal(false);
    };

    if (loading) {
        return null;
    }

    return (
        <>
            <nav ref={navRef} className="sticky top-0 bg-white w-full h-16 border-b-[1px] border-[#9BF00B] z-50 flex items-center justify-between lg:px-28 px-4">
                <Link to="/"><img src="/logo.png" alt="Logo" className="lg:h-10 h-auto lg:w-auto w-20" title="EVS" /></Link>
                <div className="flex items-center w-full md:w-auto">
                    <div className="hidden lg:flex lg:items-center lg:space-x-6 lg:ml-auto">
                        {navLinks.map((link, index) => (
                            <Link key={index} to={link.href} onClick={() => setIsOpen(false)}
                                className={`text-lg border-b-[1px] ${(link.href !== '/' && location.pathname.startsWith(link.href)) || (link.href === '/' && location.pathname === '/') ? 'border-black' : 'border-white'} hover:border-black`}>
                                {link.name}
                            </Link>
                        ))}
                        {!isLoggedIn ? (
                            <>
                                <button onClick={() => handleFormToggle('login')}
                                    className="text-lg bg-blue-600 hover:bg-blue-700 rounded px-4 py-1 text-white ml-4">
                                    Login
                                </button>
                                <button onClick={() => handleFormToggle('register')}
                                    className="text-lg bg-blue-600 hover:bg-blue-700 rounded px-4 py-1 text-white ml-4">
                                    Register
                                </button>
                            </>
                        ) : (
                            <div className="relative flex items-center">
                                <span className="text-lg cursor-pointer flex items-center border-l-[1px] pl-6 border-black" onClick={() => setShowDropdown(!showDropdown)}>
                                    {userData.voterIdCardNumber}
                                    {showDropdown ? <IoIosArrowUp className="ml-2" /> : <IoIosArrowDown className="ml-2" />}
                                </span>
                                {showDropdown && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute left-0 top-10 bg-white text-black border border-gray-300 shadow-lg rounded w-48"
                                    >
                                        <ul className="py-1">
                                            <Link to="/user-profile" className="flex items-center py-2 pl-2 w-full hover:bg-blue-600 hover:text-white">
                                                <BiSolidUser className="text-2xl" />
                                                <p className="text-lg pl-3">Profile</p>
                                            </Link>
                                            <Link to="/user-settings" className="flex items-center py-2 pl-2 w-full hover:bg-blue-600 hover:text-white">
                                                <RiSettings5Fill className="text-2xl" />
                                                <p className="text-lg pl-3">Settings</p>
                                            </Link>
                                            <button onClick={handleLogout} className="flex items-center py-2 pl-2 w-full hover:bg-blue-600 group">
                                                <IoLogOut className="text-2xl text-black group-hover:text-white" />
                                                <p className="text-red-600 group-hover:text-white pl-3">
                                                    Logout
                                                </p>
                                            </button>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="lg:hidden ml-auto">
                        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                            {isOpen ? <IoClose size={24} className="transition-transform duration-300 transform rotate-180" /> : <VscMenu size={24} className="transition-transform duration-300 transform" />}
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className="fixed inset-x-0 top-16 bg-black opacity-50 z-40 lg:hidden" style={{ height: "calc(100vh - 4rem)" }} onClick={() => setIsOpen(false)} />
                )}
                <div ref={dropdownRef} className={`lg:hidden absolute top-full right-0 border-t-[1px] border-[#9BF00B] w-full bg-white overflow-hidden drop-shadow-2xl ${isOpen ? "block" : "hidden"} z-50`}>
                    <div className="flex flex-col space-y-2 pt-2 pb-4 pl-4">
                        {navLinks.map((link, index) => (
                            <Link key={index} to={link.href} onClick={() => { setIsOpen(false); }} className={`text-lg border-b-[1px] ${location.pathname === link.href ? "border-black" : "border-white"} hover:border-black w-fit`}>
                                {link.name}
                            </Link>
                        ))}
                        {!isLoggedIn ? (
                            <div className="flex gap-5">
                                <button onClick={() => { handleFormToggle('login'); setIsOpen(false); }} className="text-lg bg-blue-600 hover:bg-blue-700 rounded w-fit px-4 py-1 text-white">
                                    Login
                                </button>
                                <button onClick={() => { handleFormToggle('register'); setIsOpen(false); }} className="text-lg bg-blue-600 hover:bg-blue-700 rounded w-fit px-4 py-1 text-white">
                                    Register
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span className="text-lg cursor-pointer flex items-center" onClick={() => setShowDropdown(!showDropdown)}>
                                    {userData.voterIdCardNumber}
                                    {showDropdown ? <IoIosArrowUp className="ml-2" /> : <IoIosArrowDown className="ml-2" />}
                                </span>
                                {showDropdown && (
                                    <div ref={dropdownRef} className="absolute left-32 top-10 bg-white text-black border border-gray-300 shadow-lg rounded w-48">
                                        <ul className="py-1">
                                            <Link to="/user-profile" className="flex items-center py-2 pl-2 w-full hover:bg-blue-600 hover:text-white">
                                                <BiSolidUser className="text-2xl" />
                                                <p className="text-lg pl-3">Profile</p>
                                            </Link>
                                            <Link to="/user-settings" className="flex items-center py-2 pl-2 w-full hover:bg-blue-600 hover:text-white">
                                                <RiSettings5Fill className="text-2xl" />
                                                <p className="text-lg pl-3">Settings</p>
                                            </Link>
                                            <button onClick={handleLogout} className="flex items-center py-2 pl-2 w-full hover:bg-blue-600 group">
                                                <IoLogOut className="text-2xl text-black group-hover:text-white" />
                                                <p className="text-red-600 group-hover:text-white pl-3">Logout</p>
                                            </button>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <OngoingVoting />

            {activeForm === "login" &&
                <LoginForm
                    onClose={() => setActiveForm(null)}
                    showRegisterForm={() => handleFormToggle("register")}
                    showForgotPasswordForm={() => handleFormToggle("forgotPassword")}
                />}
            {activeForm === "register" &&
                <RegisterForm
                    onClose={() => setActiveForm(null)}
                    showLoginForm={() => handleFormToggle("login")}
                />}
            {activeForm === "forgotPassword" &&
                <ForgotPasswordForm
                    onClose={() => setActiveForm(null)}
                    showLoginForm={() => handleFormToggle("login")}
                />}
            {showConfirmModal && (
                <ConfirmLogout
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                />
            )}
        </>
    );
}
