import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth, GoogleLoginButton } from "../shared/googleAuth/index.js";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [successNotice, setSuccessNotice] = useState(false);
  const [authedUserData, setAuthedUserData] = useState(null);

  // Hook de Autenticação Exclusiva Google OAuth (Padrão Kaline Modas)
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

  const handleGoogleLoginButtonClick = () => {
    clearGoogleError();
    triggerGoogleLogin();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative text-center">
        {/* Ícone de Chave no topo (Padrão Kaline Modas) */}
        <div className="inline-flex p-4 rounded-full bg-helpusOrange/15 border border-helpusOrange/30 text-helpusOrange text-2xl font-bold mb-1 shadow-lg shadow-helpusOrange/20">
          🔑
        </div>

        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">ACESSAR PLATAFORMA</h1>
          <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
            Entre com sua conta do Google para acessar o painel de gestão corporativo.
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

        {googleAuthError && (
          <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-2xl font-bold flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>{googleAuthError}</span>
          </div>
        )}

        {/* Botão Único e Exclusivo de Login com o Google */}
        <div className="pt-2">
          <GoogleLoginButton
            onClick={handleGoogleLoginButtonClick}
            isLoading={googleLoading}
            label="ENTRAR COM O GOOGLE"
            variant="dark"
            className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-helpusOrange font-bold text-xs rounded-2xl shadow-xl transition-all hover:scale-[1.01]"
          />
        </div>

        <div className="pt-2 text-[11px] text-neutral-500">
          Autenticação segura via Google OAuth 2.0 (HelpUS Ecosystem)
        </div>
      </div>
    </div>
  );
}
