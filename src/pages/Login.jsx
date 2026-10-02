import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleAuth, GoogleLoginButton } from "../shared/googleAuth/index.js";

export default function Login() {
  const { login, loginWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [successNotice, setSuccessNotice] = useState(false);
  const [authedUserData, setAuthedUserData] = useState(null);

  // Hook de Autenticação Google OAuth (Padrão Kaline Modas)
  const {
    isLoading: googleLoading,
    error: googleAuthError,
    login: triggerGoogleLogin,
    clearError: clearGoogleError
  } = useGoogleAuth({
    storageKey: "plural_google_auth_user",
    onSuccess: async (googleUser) => {
      clearGoogleError();
      const cleanEmail = (googleUser.email || "").toLowerCase().trim();
      const isSuperAdmin = cleanEmail === "helpus.ecommerce@gmail.com" || cleanEmail === "wagner.redes@gmail.com";
      const isOwner = cleanEmail === "pluralocacoes@gmail.com" || cleanEmail === "pluralocacoes.jp@gmail.com";

      const res = await loginWithGoogle({
        email: cleanEmail,
        name: googleUser.name || (isSuperAdmin ? "HelpUS SuperAdmin" : (isOwner ? "Plural Proprietário" : googleUser.givenName || "Usuário Plural")),
        picture: googleUser.picture || "",
        googleId: googleUser.id || ""
      });

      const userRole = res?.user?.roleCode || res?.user?.role;
      setAuthedUserData(res?.user || googleUser);
      setSuccessNotice(true);

      setTimeout(() => {
        if (userRole === "DEVELOPER" || userRole === "STORE_OWNER" || userRole === "OPERATOR") {
          navigate("/admin");
        } else {
          navigate("/minha-conta");
        }
      }, 500);
    }
  });

  const handleLoginSuccess = (res) => {
    const role = res?.user?.roleCode || res?.user?.role;
    if (role === "DEVELOPER" || role === "STORE_OWNER" || role === "OPERATOR") {
      navigate("/admin");
    } else {
      navigate("/minha-conta");
    }
  };

  const handleGoogleLoginButtonClick = () => {
    clearGoogleError();
    setErro("");
    triggerGoogleLogin();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const res = await login(email, password);
      handleLoginSuccess(res);
    } catch (err) {
      setErro(err.message || "E-mail ou senha incorretos.");
    }
  };

  const displayError = erro || googleAuthError;

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative text-center">
        {/* Ícone de Chave no topo (Padrão Kaline Modas) */}
        <div className="inline-flex p-4 rounded-full bg-helpusOrange/15 border border-helpusOrange/30 text-helpusOrange text-2xl font-bold mb-1 shadow-lg shadow-helpusOrange/20">
          🔑
        </div>

        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Acessar Plataforma</h1>
          <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
            Entre para gerenciar seus orçamentos de locação ou acesse seu painel operacional.
          </p>
        </div>

        {/* Notificação de Sucesso */}
        {successNotice && authedUserData && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-200 space-y-1 animate-fadeIn text-xs">
            <div className="font-bold text-emerald-400">
              ✅ Autenticado com Sucesso: {authedUserData.email}
            </div>
            <p className="text-emerald-300/80 text-center">
              Redirecionando para a Área Administrativa...
            </p>
          </div>
        )}

        {displayError && (
          <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-2xl font-bold flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>{displayError}</span>
          </div>
        )}

        {/* Botão Oficial de Login do Google (Padrão Kaline Modas: Simples, Direto e Elegante) */}
        <div className="pt-2">
          <GoogleLoginButton
            onClick={handleGoogleLoginButtonClick}
            isLoading={googleLoading}
            label="ENTRAR COM O GOOGLE"
            variant="dark"
            className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-helpusOrange font-bold text-xs rounded-2xl shadow-xl transition-all hover:scale-[1.01]"
          />
        </div>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-neutral-800"></div>
          <span className="px-3 text-xs text-neutral-500 font-medium">ou com e-mail e senha</span>
          <div className="flex-1 border-t border-neutral-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">E-mail *</label>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-helpusOrange"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Senha *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-helpusOrange"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
          >
            {authLoading ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>

        <div className="border-t border-neutral-800 pt-4 text-center text-xs text-neutral-400">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="text-helpusOrange font-bold hover:underline">
            Cadastre-se gratuitamente
          </Link>
        </div>
      </div>
    </div>
  );
}
