import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    // Only show on protected/dashboard-like pages
    const showNav = ['Student', 'Faculty', 'Admin'].includes(user?.role);
    if (!showNav) return null;

    const isActive = (path) => location.pathname === path;

    // Build nav items based on role
    const navItems = [];

    if (user?.role === 'Student') {
        navItems.push({
            label: 'Dashboard', path: '/dashboard', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        });
    }

    if (user?.role === 'Faculty') {
        navItems.push({
            label: 'Faculty', path: '/faculty-dashboard', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        });
    }

    if (user?.role === 'Admin') {
        navItems.push({
            label: 'Admin', path: '/admin', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        });
    }

    // Logout always last
    navItems.push({
        label: 'Logout', path: null, icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        ), action: () => { logout(); navigate('/login'); }
    });

    return (
        <>
            {/* Spacer so content doesn't hide behind the nav */}
            <div className="mobile-nav-spacer md:hidden" />

            {/* Mobile Bottom Navigation — only visible on small screens */}
            <nav className="mobile-bottom-nav md:hidden">
                <div className="flex items-stretch justify-around h-16 px-2">
                    {navItems.map((item) => {
                        const active = item.path && isActive(item.path);
                        return (
                            <button
                                key={item.label}
                                onClick={() => item.action ? item.action() : navigate(item.path)}
                                className={`relative flex flex-col items-center justify-center flex-1 gap-0.5 px-1 py-2 transition-all duration-300 rounded-xl mx-1 ${active
                                    ? 'text-indigo-400'
                                    : item.label === 'Logout'
                                        ? 'text-red-400/70 hover:text-red-400 active:scale-95'
                                        : 'text-gray-500 hover:text-gray-300 active:scale-95'
                                    }`}
                            >
                                {/* Active indicator glow */}
                                {active && (
                                    <div className="absolute inset-0 bg-indigo-500/10 rounded-xl border border-indigo-500/20" style={{ animation: 'scale-in 0.3s ease-out' }}></div>
                                )}
                                {/* Active top bar */}
                                {active && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ animation: 'slide-up-fade 0.3s ease-out' }}></div>
                                )}
                                <div className="relative z-10 transition-transform duration-300" style={active ? { transform: 'translateY(-1px)' } : {}}>
                                    {item.icon}
                                </div>
                                <span className={`relative z-10 text-[10px] font-semibold tracking-wide uppercase leading-none transition-all duration-300 ${active ? 'text-indigo-300' : ''}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default MobileNav;
