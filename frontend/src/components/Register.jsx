import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setIsSubmitting(true);

        const result = await register(name, email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent px-4 relative overflow-hidden noise-overlay">
            {/* Animated 3D Background Orbs */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-purple-600/15 rounded-full blur-[100px] float-3d pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/12 rounded-full blur-[80px] float-3d-reverse pointer-events-none translate-y-1/3 -translate-x-1/4"></div>
            <div className="absolute top-1/2 left-1/3 w-[25rem] h-[25rem] bg-violet-500/8 rounded-full blur-[70px] pulse-glow pointer-events-none"></div>

            {/* Floating Particles */}
            <div className="absolute top-[15%] right-[25%] w-2 h-2 bg-purple-400/40 rounded-full pointer-events-none" style={{ animation: 'particle-float-1 9s ease-in-out infinite' }}></div>
            <div className="absolute bottom-[25%] left-[15%] w-1.5 h-1.5 bg-blue-400/30 rounded-full pointer-events-none" style={{ animation: 'particle-float-2 11s ease-in-out infinite' }}></div>
            <div className="absolute top-[50%] right-[40%] w-1 h-1 bg-violet-400/50 rounded-full pointer-events-none" style={{ animation: 'particle-float-3 13s ease-in-out infinite' }}></div>
            <div className="absolute bottom-[40%] left-[60%] w-1.5 h-1.5 bg-indigo-400/30 rounded-full pointer-events-none" style={{ animation: 'particle-float-1 15s ease-in-out infinite 3s' }}></div>

            {/* Spinning Grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.025]">
                <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 spin-slow">
                    <div className="absolute inset-0 border border-purple-300/20 rounded-full"></div>
                    <div className="absolute inset-[20%] border border-purple-300/15 rounded-full"></div>
                    <div className="absolute inset-[40%] border border-purple-300/10 rounded-full"></div>
                </div>
            </div>

            <div className="perspective-container w-full max-w-md relative z-10">
                <div className="glass-card gradient-border rounded-3xl shadow-2xl p-8 m-6" style={{ animation: 'card-entrance 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                    <div className="text-center mb-8" style={{ animation: 'slide-up-fade 0.6s ease-out 0.2s both' }}>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30" style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                        <p className="text-gray-400 mt-2 text-sm">Join the platform to access premium tests</p>
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
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="John Doe"
                            />
                        </div>
                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.35s both' }}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="you@email.com"
                            />
                        </div>
                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.45s both' }}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="••••••••"
                            />
                        </div>
                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.55s both' }}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                                placeholder="••••••••"
                            />
                        </div>

                        <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.65s both' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-3d w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 text-white font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.75s both' }}>
                        <p className="mt-6 text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-all duration-300 hover:underline decoration-purple-400/50 underline-offset-4">
                                Log in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
