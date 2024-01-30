import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) =>
{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() =>
    {
        const storedToken = localStorage.getItem("jwtToken");

        if (storedToken)
        {
            const decodedToken = jwtDecode(storedToken);

            setUser({ token: storedToken, decodedToken });
        }

        setLoading(false);
    }, []);

    const login = (token) =>
    {
        const decodedToken = jwtDecode(token);

        setUser({ token, decodedToken });

        localStorage.setItem("jwtToken", token);

        navigate('/');
    };

    const logout = () =>
    {
        setUser(null);

        localStorage.removeItem("jwtToken");

        navigate('/');
    };

    if (loading)
    {
        return <Loading />;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
