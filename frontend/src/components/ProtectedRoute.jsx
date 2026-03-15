import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { token, user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to a specialized unauthorized page or dashboard if they don't have the right role
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
