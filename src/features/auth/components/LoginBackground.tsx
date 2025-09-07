import React from "react";

const LoginBackground: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    {/* Animated circles and lines for energy */}
    <div className="animate-pulse-slow absolute top-1/4 left-1/3 w-32 h-32 bg-purple-700 opacity-30 rounded-full blur-2xl" />
    <div className="animate-pulse-fast absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500 opacity-20 rounded-full blur-2xl" />
    <div className="animate-spin-slow absolute top-1/2 left-1/2 w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full opacity-30" />
    {/* Sporty accent: diagonal lines */}
    <div className="absolute top-0 left-0 w-2/3 h-2 rotate-12 bg-gradient-to-r from-yellow-400 to-pink-500 opacity-30 animate-slide" />
    <div className="absolute bottom-0 right-0 w-1/2 h-2 -rotate-12 bg-gradient-to-r from-pink-500 to-purple-700 opacity-30 animate-slide-reverse" />
    {/* Animated sporty cars SVGs */}
    <div className="absolute left-0 bottom-10 w-32 h-16 animate-car-left">
      <svg viewBox="0 0 128 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="80" height="20" rx="10" fill="#f472b6" />
        <rect x="40" y="20" width="40" height="20" rx="8" fill="#a855f7" />
        <circle cx="35" cy="55" r="8" fill="#facc15" stroke="#222" strokeWidth="3" />
        <circle cx="93" cy="55" r="8" fill="#facc15" stroke="#222" strokeWidth="3" />
        <rect x="60" y="35" width="8" height="8" rx="2" fill="#fff" />
      </svg>
    </div>
    <div className="absolute right-0 top-16 w-28 h-14 animate-car-right">
      <svg viewBox="0 0 112 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="26" width="64" height="16" rx="8" fill="#facc15" />
        <rect x="32" y="16" width="32" height="16" rx="6" fill="#a855f7" />
        <circle cx="28" cy="46" r="7" fill="#f472b6" stroke="#222" strokeWidth="3" />
        <circle cx="76" cy="46" r="7" fill="#f472b6" stroke="#222" strokeWidth="3" />
        <rect x="48" y="30" width="7" height="7" rx="2" fill="#fff" />
      </svg>
    </div>
  </div>
);

export default LoginBackground;
