import { signIn, useSession, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { setApiToken } from "../utils/api";
import TextInput from "../components/TextInput";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { status } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password
    });
    if (res?.error) {
      setError("Invalid username or password");
    } else {
      // Wait for session to update, then set token
      setTimeout(async () => {
        const session = await getSession();
        // NextAuth stores the JWT in session.data (for credentials provider)
        // If using credentials, you may need to fetch it from session.data or session.accessToken
        const jwtToken = (session as any)?.accessToken;
        if (jwtToken && typeof jwtToken === "string") {
          setApiToken(jwtToken);
          console.log("JWT token set in localStorage:", jwtToken);
        } else {
          console.warn("No JWT token found in session after login.", session);
        }
      }, 500);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <>
      <head>
        <title>PLAYTASTIC Login</title>
        <meta name="description" content="Login to PLAYTASTIC" />
        <link rel="icon" href="/playtastic-logo.svg" />
      </head>
      {/* Sporty animated background */}
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] overflow-hidden">
        {/* Dynamic background shapes for sporty look */}
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
        {/* Animated glowing border for the login box */}
        <div className="relative z-10 bg-white/10 rounded-lg shadow-lg p-8 w-full max-w-sm flex flex-col items-center border-2 border-purple-600 animate-glow">
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
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <TextInput
              label="Username"
              value={username}
              onChange={setUsername}
              required
              placeholder="Enter your username"
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
              placeholder="Enter your password"
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-semibold rounded transition-colors animate-button-pop border-2 border-purple-600 shadow-md"
            >
              Login
            </button>
          </form>
        </div>
        {/* Add custom keyframes for animation effects */}
        <style jsx>{`
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.2); opacity: 0.5; }
          }
          @keyframes pulse-fast {
            0%, 100% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.4); opacity: 0.4; }
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px 5px #a855f7, 0 0 40px 10px #f472b6; }
            50% { box-shadow: 0 0 40px 10px #a855f7, 0 0 60px 20px #f472b6; }
          }
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes button-pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes slide {
            0% { transform: translateX(-100px); opacity: 0.2; }
            100% { transform: translateX(100px); opacity: 0.3; }
          }
          @keyframes slide-reverse {
            0% { transform: translateX(100px); opacity: 0.2; }
            100% { transform: translateX(-100px); opacity: 0.3; }
          }
          @keyframes car-left {
            0% { left: -120px; opacity: 0.2; }
            50% { left: 40px; opacity: 0.7; }
            100% { left: -120px; opacity: 0.2; }
          }
          @keyframes car-right {
            0% { right: -120px; opacity: 0.2; }
            50% { right: 40px; opacity: 0.7; }
            100% { right: -120px; opacity: 0.2; }
          }
          .animate-pulse-slow { animation: pulse-slow 3s infinite; }
          .animate-pulse-fast { animation: pulse-fast 2s infinite; }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
          .animate-glow { animation: glow 2.5s infinite alternate; }
          .animate-fade-in { animation: fade-in 1s ease-out forwards; }
          .animate-button-pop { animation: button-pop 1.2s infinite; }
          .animate-bounce { animation: bounce 1.5s infinite; }
          .animate-slide { animation: slide 4s infinite alternate; }
          .animate-slide-reverse { animation: slide-reverse 4s infinite alternate; }
          .animate-trophy { animation: bounce 2s infinite; }
          .animate-car-left { animation: car-left 6s linear infinite; }
          .animate-car-right { animation: car-right 7s linear infinite; }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </>
  );
}
