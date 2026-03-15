import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If we have a token, we could fetch user profile here to keep them logged in
        // For now, we'll just check if token exists to assume they are logged in.
        // A better approach in production is validating the token on refresh.
        if (token) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const data = res.data;
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, role: data.user.role };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post('/api/auth/register', {
                name,
                email,
                password,
                role: 'Student' // Defaulting to Student Registration
            });
            const data = res.data;
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, role: data.user.role };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const registerFaculty = async (name, email, password, facultyId) => {
        try {
            const res = await axios.post('/api/auth/register', {
                name,
                email,
                password,
                role: 'Faculty',
                facultyId
            });
            const data = res.data;
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, role: data.user.role };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Faculty Registration failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, registerFaculty, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
