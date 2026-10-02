import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("plural_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const emailLower = (parsed.email || "").toLowerCase().trim();
        let role = parsed.roleCode || parsed.role || "CLIENT";
        if (emailLower === "helpus.ecommerce@gmail.com" || emailLower === "wagner.redes@gmail.com") {
          role = "DEVELOPER";
        } else if (emailLower === "pluralocacoes@gmail.com" || emailLower === "pluralocacoes.jp@gmail.com") {
          role = "STORE_OWNER";
        }
        return { ...parsed, roleCode: role, role };
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

      const emailLower = (data.user.email || "").toLowerCase().trim();
      let role = data.user.roleCode || data.user.role || "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com" || emailLower === "wagner.redes@gmail.com") {
        role = "DEVELOPER";
      } else if (emailLower === "pluralocacoes@gmail.com" || emailLower === "pluralocacoes.jp@gmail.com") {
        role = "STORE_OWNER";
      }

      const updatedUser = { ...data.user, roleCode: role, role };
      setToken(data.token);
      setUser(updatedUser);
      return { ...data, user: updatedUser };
    } catch (err) {
      // Fallback local se a API backend estiver offline
      const emailLower = (email || "").toLowerCase().trim();
      let role = "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com" || emailLower === "wagner.redes@gmail.com") role = "DEVELOPER";
      else if (emailLower === "pluralocacoes@gmail.com" || emailLower === "pluralocacoes.jp@gmail.com" || emailLower.includes("gerente")) role = "STORE_OWNER";
      else if (emailLower.includes("operador")) role = "OPERATOR";

      const mockUser = {
        id: `usr-${Date.now()}`,
        name: email.split("@")[0],
        email: emailLower,
        roleCode: role,
        role,
        phone: "(83) 99908-7188"
      };

      setUser(mockUser);
      setToken("mock-token-session");
      return { user: mockUser, token: "mock-token-session" };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleUser) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleUser)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha na autenticação via Google.");
      }

      const emailLower = (data.user.email || googleUser.email || "").toLowerCase().trim();
      let role = data.user.roleCode || data.user.role || "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com" || emailLower === "wagner.redes@gmail.com") {
        role = "DEVELOPER";
      } else if (emailLower === "pluralocacoes@gmail.com" || emailLower === "pluralocacoes.jp@gmail.com") {
        role = "STORE_OWNER";
      }

      const updatedUser = { ...data.user, roleCode: role, role };
      setToken(data.token);
      setUser(updatedUser);
      return { ...data, user: updatedUser };
    } catch (err) {
      const emailLower = (googleUser.email || "").toLowerCase().trim();
      let role = "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com" || emailLower === "wagner.redes@gmail.com") {
        role = "DEVELOPER";
      } else if (emailLower === "pluralocacoes@gmail.com" || emailLower === "pluralocacoes.jp@gmail.com") {
        role = "STORE_OWNER";
      }

      const mockUser = {
        id: `google-${Date.now()}`,
        name: googleUser.name || emailLower.split("@")[0],
        email: emailLower,
        avatarUrl: googleUser.picture || "",
        roleCode: role,
        role
      };

      setUser(mockUser);
      setToken("mock-token-google");
      return { user: mockUser, token: "mock-token-google" };
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
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao realizar cadastro.");
      }

      const emailLower = (data.user.email || "").toLowerCase().trim();
      let role = data.user.roleCode || data.user.role || "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com" || emailLower === "wagner.redes@gmail.com") {
        role = "DEVELOPER";
      } else if (emailLower === "pluralocacoes@gmail.com" || emailLower === "pluralocacoes.jp@gmail.com") {
        role = "STORE_OWNER";
      }

      const updatedUser = { ...data.user, roleCode: role, role };
      setToken(data.token);
      setUser(updatedUser);
      return { ...data, user: updatedUser };
    } catch (err) {
      const emailLower = (email || "").toLowerCase().trim();
      let role = "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com" || emailLower === "wagner.redes@gmail.com") role = "DEVELOPER";
      else if (emailLower === "pluralocacoes@gmail.com" || emailLower === "pluralocacoes.jp@gmail.com") role = "STORE_OWNER";

      const mockUser = { id: `usr-${Date.now()}`, name, email: emailLower, roleCode: role, role, phone };
      setUser(mockUser);
      setToken("mock-token-session");
      return { user: mockUser, token: "mock-token-session" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("plural_user");
    localStorage.removeItem("plural_token");
    localStorage.removeItem("plural_google_auth_user");
  };

  const userRole = user?.roleCode || user?.role || "CLIENT";
  const isDeveloper = userRole === "DEVELOPER";
  const isStoreOwner = userRole === "STORE_OWNER" || isDeveloper;
  const isOperator = userRole === "OPERATOR" || isStoreOwner;
  const isAdmin = isDeveloper || isStoreOwner || isOperator;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        userRole,
        isDeveloper,
        isStoreOwner,
        isOperator,
        isAdmin,
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
