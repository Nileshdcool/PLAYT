import { signIn, useSession, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { setApiToken } from "../utils/api";
import { useRouter } from "next/router";
import LoginHeader from "../features/auth/components/LoginHeader";
import LoginForm from "../features/auth/components/LoginForm";
import LoginBackground from "../features/auth/components/LoginBackground";

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
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] overflow-hidden">
        <LoginBackground />
        <div className="relative z-10 bg-white/10 rounded-lg shadow-lg p-8 w-full max-w-sm flex flex-col items-center border-2 border-purple-600 animate-glow">
          <LoginHeader />
          <LoginForm
            username={username}
            password={password}
            error={error}
            setUsername={setUsername}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
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
