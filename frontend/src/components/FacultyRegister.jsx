import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FacultyRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { registerFaculty } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setIsSubmitting(true);

        const result = await registerFaculty(name, email, password, facultyId);

        if (result.success) {
            navigate('/faculty-dashboard');
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent px-4 relative overflow-hidden noise-overlay">
            {/* Animated 3D Background Orbs */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-pink-600/12 rounded-full blur-[100px] float-3d pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[80px] float-3d-reverse pointer-events-none translate-y-1/3 -translate-x-1/4"></div>
            <div className="absolute top-1/3 right-1/3 w-[20rem] h-[20rem] bg-rose-500/8 rounded-full blur-[60px] pulse-glow pointer-events-none"></div>

            {/* Floating Particles */}
            <div className="absolute top-[10%] left-[25%] w-2 h-2 bg-pink-400/40 rounded-full pointer-events-none" style={{ animation: 'particle-float-1 10s ease-in-out infinite' }}></div>
            <div className="absolute bottom-[20%] right-[15%] w-1.5 h-1.5 bg-amber-400/30 rounded-full pointer-events-none" style={{ animation: 'particle-float-2 12s ease-in-out infinite' }}></div>
            <div className="absolute top-[55%] left-[45%] w-1 h-1 bg-rose-400/50 rounded-full pointer-events-none" style={{ animation: 'particle-float-3 14s ease-in-out infinite' }}></div>

            {/* Spinning Grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
                <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 spin-slow">
                    <div className="absolute inset-0 border border-pink-300/20 rounded-full"></div>
                    <div className="absolute inset-[25%] border border-pink-300/15 rounded-full"></div>
                    <div className="absolute inset-[50%] border border-pink-300/10 rounded-full"></div>
                </div>
            </div>

            <div className="perspective-container w-full max-w-md relative z-10">
                <div className="glass-card gradient-border rounded-3xl shadow-2xl p-8 m-6" style={{ animation: 'card-entrance 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                    <div className="text-center mb-8" style={{ animation: 'slide-up-fade 0.6s ease-out 0.2s both' }}>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30" style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Faculty Registration</h2>
                        <p className="text-gray-400 mt-2 text-sm">Join the platform to manage tests and assess students</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/15 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center backdrop-blur-sm" style={{ animation: 'slide-up-fade 0.3s ease-out' }}>
                            <svg className="w-5 h-5 mr-3 inline-block flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.25s both' }}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="Prof. Jane Doe"
                            />
                        </div>
                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.35s both' }}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="jane@university.edu"
                            />
                        </div>
                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.45s both' }}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Faculty ID</label>
                            <input
                                type="text"
                                required
                                value={facultyId}
                                onChange={(e) => setFacultyId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="FAC-2026-XYZ"
                            />
                        </div>
                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.55s both' }}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="••••••••"
                            />
                        </div>

                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.65s both' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-3d w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 text-white font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : 'Register as Faculty'}
                            </button>
                        </div>
                    </form>

                    <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.75s both' }}>
                        <p className="mt-6 text-center text-sm text-gray-400">
                            Are you a student?{' '}
                            <Link to="/register" className="text-pink-400 hover:text-pink-300 font-medium transition-all duration-300 hover:underline decoration-pink-400/50 underline-offset-4">
                                Student Registration
                            </Link>
                        </p>
                        <div className="mt-2 text-center text-sm text-gray-400">
                            <Link to="/login" className="text-pink-400/80 hover:text-pink-300 font-medium transition-all duration-300 hover:underline decoration-pink-400/50 underline-offset-4">
                                Already have an account? Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyRegister;
