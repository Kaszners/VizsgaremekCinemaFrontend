import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getMyProfile } from "../services/api";
import { logout as doLogout, getToken } from "../services/authService";

interface Profile { email: string; fullName: string; role: string; }
interface AuthCtx { profile: Profile | null; loading: boolean; refresh: () => Promise<void>; logout: () => void; }

const AuthContext = createContext<AuthCtx>({ profile: null, loading: true, refresh: async () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!getToken()) { setProfile(null); setLoading(false); return; }
    try { setProfile(await getMyProfile()); }
    catch { setProfile(null); doLogout(); }
    setLoading(false);
  };

  const logout = () => { doLogout(); setProfile(null); };
  useEffect(() => { refresh(); }, []);

  return <AuthContext.Provider value={{ profile, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
