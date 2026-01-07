import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiFetch } from "../lib/api/api-fetch";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  email: string;
  role: "OWNER" | "ADMIN" | "TRAINER" | "USER"; 
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (data: unknown) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await apiFetch<User>("/auth/me");
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (formData: unknown) => {
    await apiFetch<{ token: string; role: string }>("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    
    await checkAuth();
    
    navigate("/admin/dashboard/inicio");
  };

  const signOut = async () => {
    try {
        await apiFetch("/auth/sign-out", { method: "POST" });
    } catch (error) {
        console.error("Error signing out", error);
    }
    setUser(null);
    localStorage.removeItem("role");
    navigate("/auth/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, checkAuth }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
