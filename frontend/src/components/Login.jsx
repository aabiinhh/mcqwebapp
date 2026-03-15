import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            if (result.role === 'Admin') {
                navigate('/admin');
            } else if (result.role === 'Faculty') {
                navigate('/faculty-dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent px-4 relative overflow-hidden noise-overlay">
            {/* Animated 3D Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[80px] float-3d pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-600/15 rounded-full blur-[100px] float-3d-reverse pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 w-[20rem] h-[20rem] bg-cyan-500/10 rounded-full blur-[60px] pulse-glow pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

            {/* Floating Particles */}
            <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-indigo-400/40 rounded-full pointer-events-none" style={{ animation: 'particle-float-1 8s ease-in-out infinite' }}></div>
            <div className="absolute top-[60%] right-[20%] w-1.5 h-1.5 bg-purple-400/30 rounded-full pointer-events-none" style={{ animation: 'particle-float-2 10s ease-in-out infinite' }}></div>
            <div className="absolute bottom-[30%] left-[40%] w-1 h-1 bg-cyan-400/50 rounded-full pointer-events-none" style={{ animation: 'particle-float-3 12s ease-in-out infinite' }}></div>
            <div className="absolute top-[40%] right-[35%] w-1.5 h-1.5 bg-blue-400/30 rounded-full pointer-events-none" style={{ animation: 'particle-float-1 14s ease-in-out infinite 2s' }}></div>
            <div className="absolute bottom-[50%] left-[60%] w-2 h-2 bg-violet-400/20 rounded-full pointer-events-none" style={{ animation: 'particle-float-2 9s ease-in-out infinite 1s' }}></div>

            {/* Spinning Grid (subtle geometric background) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 spin-slow">
                    <div className="absolute inset-0 border border-white/20 rounded-full"></div>
                    <div className="absolute inset-[15%] border border-white/15 rounded-full"></div>
                    <div className="absolute inset-[30%] border border-white/10 rounded-full"></div>
                    <div className="absolute inset-[45%] border border-white/5 rounded-full"></div>
                </div>
            </div>

            {/* 3D Login Card */}
            <div className="perspective-container w-full max-w-md relative z-10">
                <div className="glass-card gradient-border rounded-3xl shadow-2xl p-8 page-enter" style={{ animation: 'card-entrance 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                    {/* Logo/Brand Area */}
                    <div className="text-center mb-8" style={{ animation: 'slide-up-fade 0.6s ease-out 0.2s both' }}>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30" style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-gray-400 mt-2 text-sm">Sign in to continue your mastery journey</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/15 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center backdrop-blur-sm" style={{ animation: 'slide-up-fade 0.3s ease-out' }}>
                            <svg className="w-5 h-5 mr-3 inline-block flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.3s both' }}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="you@email.com"
                            />
                        </div>
                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.4s both' }}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="••••••••"
                            />
                        </div>

                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.5s both' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-3d w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.6s both' }}>
                        <p className="mt-8 text-center text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-all duration-300 hover:underline decoration-indigo-400/50 underline-offset-4">
                                Create one now
                            </Link>
                        </p>
                        <div className="mt-3 text-center text-sm text-gray-400">
                            <Link to="/faculty-register" className="text-pink-400/80 hover:text-pink-300 font-medium transition-all duration-300 hover:underline decoration-pink-400/50 underline-offset-4">
                                Register as Faculty
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
