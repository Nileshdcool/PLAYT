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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="bg-white/10 rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
