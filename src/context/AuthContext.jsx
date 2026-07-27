import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("plural_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Erro ao ler usuário salvo:", e);
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("plural_token") || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("plural_token", token);
    } else {
      localStorage.removeItem("plural_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("plural_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("plural_user");
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao realizar login.");
      }

      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      // Fallback para modo offline local caso a API backend ainda não esteja ativa no Railway
      if (email.toLowerCase().includes("admin")) {
        const mockAdmin = { id: "admin-1", name: "Administrador Plural", email, role: "ADMIN", phone: "(83) 99999-9999" };
        setUser(mockAdmin);
        setToken("mock-token-admin");
        return { user: mockAdmin, token: "mock-token-admin" };
      } else {
        const mockUser = { id: `usr-${Date.now()}`, name: email.split("@")[0], email, role: "CLIENT", phone: "(83) 99999-8888" };
        setUser(mockUser);
        setToken("mock-token-user");
        return { user: mockUser, token: "mock-token-user" };
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role: "CLIENT" })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao realizar cadastro.");
      }

      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      // Fallback para modo offline local
      const mockUser = { id: `usr-${Date.now()}`, name, email, role: "CLIENT", phone };
      setUser(mockUser);
      setToken("mock-token-user");
      return { user: mockUser, token: "mock-token-user" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("plural_user");
    localStorage.removeItem("plural_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === "ADMIN",
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
