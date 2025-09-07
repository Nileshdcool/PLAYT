import React from "react";
import TextInput from "../../../components/TextInput";

interface LoginFormProps {
  username: string;
  password: string;
  error: string;
  setUsername: (val: string) => void;
  setPassword: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  error,
  setUsername,
  setPassword,
  handleSubmit,
}) => (
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
);

export default LoginForm;
