import { createContext, useContext, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AuthContext = createContext(null);

async function api(path, options = {}) {
  const token = localStorage.getItem("wcg_token");
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("wcg_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("wcg_token");
    if (!token) return;
    setLoading(true);
    api("/auth/me")
      .then(({ user: fresh }) => {
        setUser(fresh);
        localStorage.setItem("wcg_user", JSON.stringify(fresh));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  async function authenticate(path, payload) {
    const data = await api(path, { method: "POST", body: JSON.stringify(payload) });
    localStorage.setItem("wcg_token", data.token);
    localStorage.setItem("wcg_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("wcg_token");
    localStorage.removeItem("wcg_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      api,
      login: (payload) => authenticate("/auth/login", payload),
      register: (payload) => authenticate("/auth/register", payload),
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
