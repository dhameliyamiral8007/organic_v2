import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, setToken, getToken, unwrap } from "@/lib/api";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!getToken()) {
      setUser(null);
      return;
    }
    try {
      const res = await api.get("/api/users/profile");
      const data = unwrap<any>(res);
      setUser(data?.user ?? data ?? null);
    } catch {
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/api/users/login", { email, password });
    const body = res.data;
    const token = body.token || body?.data?.token;
    if (!token) throw new Error("No token returned");
    setToken(token);
    await refresh();
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await api.post("/api/users/register", data);
    const body = res.data;
    const token = body.token || body?.data?.token;
    if (token) {
      setToken(token);
      await refresh();
    } else {
      // fallback: login after register
      await login(data.email, data.password);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
