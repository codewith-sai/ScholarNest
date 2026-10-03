import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session once on app load (cookie-based)
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (active) setUser(data?.data?.user || null);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback((loggedInUser) => {
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore: clear local state anyway
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};

export default AuthContext;