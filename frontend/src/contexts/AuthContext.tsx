import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Role, User } from "../types/api";
import { login as apiLogin, signup as apiSignup } from "../services/api";

interface AuthContextValue {
  token: string | null;
  role: Role | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: { name: string; email: string; password: string; role: Role; region?: string }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("harvestmind_token"));
  const [role, setRole] = useState<Role | null>(() => (localStorage.getItem("harvestmind_role") as Role | null) ?? null);
  const [user] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      role,
      user,
      signIn: async (email, password) => {
        const response = await apiLogin(email, password);
        localStorage.setItem("harvestmind_token", response.access_token);
        localStorage.setItem("harvestmind_role", response.role);
        setToken(response.access_token);
        setRole(response.role);
      },
      signUp: async (payload) => {
        const response = await apiSignup(payload);
        localStorage.setItem("harvestmind_token", response.access_token);
        localStorage.setItem("harvestmind_role", response.role);
        setToken(response.access_token);
        setRole(response.role);
      },
      signOut: () => {
        localStorage.removeItem("harvestmind_token");
        localStorage.removeItem("harvestmind_role");
        setToken(null);
        setRole(null);
      }
    }),
    [role, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
