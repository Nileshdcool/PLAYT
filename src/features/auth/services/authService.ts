import type { User } from "../types/user";

export function authenticate(username: string, password: string): User | null {
  // Replace with real authentication logic
  if (username === "admin" && password === "password") {
    return {
      id: "1",
      name: "Admin",
      email: "admin@example.com"
    };
  }
  return null;
}
