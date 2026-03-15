import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import TestEngine from './components/TestEngine';
import StudentDashboard from './components/StudentDashboard';
import Login from './components/Login';
import Register from './components/Register';
import FacultyRegister from './components/FacultyRegister';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import MobileNav from './components/MobileNav';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-transparent relative text-white font-sans selection:bg-indigo-500/30">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/faculty-register" element={<FacultyRegister />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/test/:testId" element={<TestEngine />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Faculty Route */}
            <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
              <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
            </Route>
          </Routes>

          {/* Global bottom navigation bar for mobile */}
          <MobileNav />
        </div>
      </AuthProvider>
    </Router>
  );
}


export default App;
