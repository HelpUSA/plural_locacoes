import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleAuth, GoogleLoginButton } from "../shared/googleAuth/index.js";

export default function Login() {
  const { login, loginWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [authedUserData, setAuthedUserData] = useState(null);

  // Hook Mestre de Autenticação Google OAuth (@shared/googleAuth - Padrão Publicarte & Ecossistema HelpUS)
  const {
    user: googleAuthUser,
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
      }, 600);
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

    if (!isCaptchaVerified) {
      alert('Por favor, marque a caixa "Não sou um robô" para continuar com o login.');
      return;
    }

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
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 rounded-full bg-helpusOrange/15 border border-helpusOrange/30 text-helpusOrange text-2xl font-bold mb-1 shadow-lg shadow-helpusOrange/20">
            🔐
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">PAINEL ADMINISTRATIVO</h1>
          <h2 className="text-xs font-bold text-helpusOrange uppercase tracking-wider">PLURAL LOCAÇÕES & EVENTOS</h2>
          <p className="text-neutral-400 text-xs mt-1">
            Acesso restrito para gestão da loja, catálogo e controle de orçamentos.
          </p>
        </div>

        {/* Notificação de Sucesso ao Autenticar via Google */}
        {successNotice && authedUserData && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-200 space-y-2 animate-fadeIn backdrop-blur">
            <div className="flex items-center justify-center gap-2 font-bold text-xs text-emerald-400">
              <span>✅ Autenticado com Sucesso: {authedUserData.email}</span>
            </div>
            <p className="text-xs text-emerald-300/90 text-center leading-relaxed">
              Redirecionando para a Área Administrativa...
            </p>
          </div>
        )}

        {displayError && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-2xl font-bold flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>{displayError}</span>
          </div>
        )}

        {/* Widget de Captcha "Não sou um robô" (Padrão Publicarte & HelpUS Ecosystem) */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between my-2 text-left shadow-inner">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isCaptchaVerified}
              onChange={(e) => {
                setIsCaptchaVerified(e.target.checked);
                if (e.target.checked) {
                  setErro("");
                  clearGoogleError();
                }
              }}
              className="w-5 h-5 accent-helpusOrange rounded border-neutral-700 cursor-pointer"
            />
            <span className="text-xs font-bold text-neutral-200">Não sou um robô</span>
          </label>
          <div className="flex flex-col items-end text-[10px] text-neutral-500">
            <span className="text-helpusOrange font-bold">🛡️ reCAPTCHA</span>
            <span>Segurança HelpUS</span>
          </div>
        </div>

        {/* Botão Oficial de Login do Google (Padrão Publicarte & Ecossistema HelpUS) */}
        <div className="pt-1">
          <GoogleLoginButton
            onClick={handleGoogleLoginButtonClick}
            isLoading={googleLoading}
            disabled={!isCaptchaVerified || googleLoading}
            label="ENTRAR COM O GOOGLE"
            variant="dark"
            className={!isCaptchaVerified ? "opacity-50 cursor-not-allowed" : ""}
          />
        </div>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-neutral-800"></div>
          <span className="px-3 text-xs text-neutral-500 font-medium">ou com e-mail e senha</span>
          <div className="flex-1 border-t border-neutral-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

        <div className="border-t border-neutral-800 pt-4 text-center text-xs text-neutral-400 space-y-2">
          <div>
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="text-helpusOrange font-bold hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
