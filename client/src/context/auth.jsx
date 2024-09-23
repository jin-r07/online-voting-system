import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userId, setUserId] = useState(null);

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get("token");
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:8080/api/user-authenticated", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setUserData(response.data);
                    setUserId(response.data._id);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error fetching user data", error);
                setIsAuthenticated(false);
                Cookies.remove("token");
            }
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post("http://localhost:8080/api/login-user", credentials);
            if (response.status === 200) {
                const { token, user } = response.data;
                Cookies.set("token", token, { expires: 7 });
                setUserData(user);
                setUserId(user._id);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setUserData(null);
        setUserId(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}