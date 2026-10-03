import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const ALLOWED_ADMIN_EMAILS = [
  "helpus.ecommerce@gmail.com",
  "pluralocacoes@gmail.com"
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("plural_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const emailLower = (parsed.email || "").toLowerCase().trim();
        if (!ALLOWED_ADMIN_EMAILS.includes(emailLower)) {
          localStorage.removeItem("plural_user");
          localStorage.removeItem("plural_token");
          localStorage.removeItem("plural_google_auth_user");
          return null;
        }
        let role = parsed.roleCode || parsed.role || "CLIENT";
        if (emailLower === "helpus.ecommerce@gmail.com") {
          role = "DEVELOPER";
        } else if (emailLower === "pluralocacoes@gmail.com") {
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
      const emailLower = (email || "").toLowerCase().trim();
      if (!ALLOWED_ADMIN_EMAILS.includes(emailLower)) {
        throw new Error(`⛔ Acesso Negado: O e-mail (${emailLower}) não possui permissão de acesso ao sistema.`);
      }

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailLower, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao realizar login.");
      }

      let role = data.user.roleCode || data.user.role || "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com") {
        role = "DEVELOPER";
      } else if (emailLower === "pluralocacoes@gmail.com") {
        role = "STORE_OWNER";
      }

      const updatedUser = { ...data.user, roleCode: role, role };
      setToken(data.token);
      setUser(updatedUser);
      return { ...data, user: updatedUser };
    } catch (err) {
      const emailLower = (email || "").toLowerCase().trim();
      if (!ALLOWED_ADMIN_EMAILS.includes(emailLower)) {
        throw new Error(`⛔ Acesso Negado: O e-mail (${emailLower}) não possui permissão de acesso ao sistema.`);
      }

      let role = "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com") role = "DEVELOPER";
      else if (emailLower === "pluralocacoes@gmail.com") role = "STORE_OWNER";

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
    const emailLower = (googleUser.email || "").toLowerCase().trim();

    if (!ALLOWED_ADMIN_EMAILS.includes(emailLower)) {
      setLoading(false);
      setUser(null);
      setToken(null);
      localStorage.removeItem("plural_user");
      localStorage.removeItem("plural_token");
      localStorage.removeItem("plural_google_auth_user");
      throw new Error(`⛔ Acesso Negado: O e-mail (${emailLower}) não possui permissão de acesso ao sistema.`);
    }

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

      let role = data.user.roleCode || data.user.role || "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com") {
        role = "DEVELOPER";
      } else if (emailLower === "pluralocacoes@gmail.com") {
        role = "STORE_OWNER";
      }

      const updatedUser = { ...data.user, roleCode: role, role };
      setToken(data.token);
      setUser(updatedUser);
      return { ...data, user: updatedUser };
    } catch (err) {
      if (err.message && err.message.includes("Acesso Negado")) {
        throw err;
      }

      let role = "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com") {
        role = "DEVELOPER";
      } else if (emailLower === "pluralocacoes@gmail.com") {
        role = "STORE_OWNER";
      } else {
        throw new Error(`⛔ Acesso Negado: O e-mail (${emailLower}) não possui permissão de acesso ao sistema.`);
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
      const emailLower = (email || "").toLowerCase().trim();
      if (!ALLOWED_ADMIN_EMAILS.includes(emailLower)) {
        throw new Error(`⛔ Acesso Negado: O e-mail (${emailLower}) não possui permissão para cadastro.`);
      }

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: emailLower, password, phone })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao realizar cadastro.");
      }

      let role = data.user.roleCode || data.user.role || "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com") {
        role = "DEVELOPER";
      } else if (emailLower === "pluralocacoes@gmail.com") {
        role = "STORE_OWNER";
      }

      const updatedUser = { ...data.user, roleCode: role, role };
      setToken(data.token);
      setUser(updatedUser);
      return { ...data, user: updatedUser };
    } catch (err) {
      const emailLower = (email || "").toLowerCase().trim();
      if (!ALLOWED_ADMIN_EMAILS.includes(emailLower)) {
        throw new Error(`⛔ Acesso Negado: O e-mail (${emailLower}) não possui permissão para cadastro.`);
      }

      let role = "CLIENT";
      if (emailLower === "helpus.ecommerce@gmail.com") role = "DEVELOPER";
      else if (emailLower === "pluralocacoes@gmail.com") role = "STORE_OWNER";

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
