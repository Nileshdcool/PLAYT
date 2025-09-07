import React from "react";

const LoginHeader: React.FC = () => (
  <>
    {/* Sporty trophy icon */}
    <span className="mb-2 animate-trophy">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto">
        <path d="M12 2C13.1046 2 14 2.89543 14 4V5H19C19.5523 5 20 5.44772 20 6V8C20 10.7614 17.3137 13 14 13H10C6.68629 13 4 10.7614 4 8V6C4 5.44772 4.44772 5 5 5H10V4C10 2.89543 10.8954 2 12 2Z" fill="#facc15"/>
        <rect x="9" y="15" width="6" height="2" rx="1" fill="#a855f7"/>
        <rect x="10" y="17" width="4" height="2" rx="1" fill="#f472b6"/>
      </svg>
    </span>
    <img src="/playtastic-logo.svg" alt="PLAYTASTIC Logo" className="h-16 w-16 mb-3 animate-bounce" />
    <h1 className="text-3xl font-extrabold mb-2 text-center text-white animate-fade-in">PLAYTASTIC</h1>
    <h2 className="text-2xl font-bold mb-6 text-center text-white animate-fade-in delay-200">Login</h2>
  </>
);

export default LoginHeader;
