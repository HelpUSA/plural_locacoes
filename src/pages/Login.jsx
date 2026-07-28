import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const res = await login(email, password);
      const role = res.user.roleCode || res.user.role;
      if (role === "DEVELOPER" || role === "STORE_OWNER" || role === "OPERATOR") {
        navigate("/admin");
      } else {
        navigate("/minha-conta");
      }
    } catch (err) {
      setErro(err.message || "E-mail ou senha incorretos.");
    }
  };

  const handleSimularGoogle = async () => {
    setErro("");
    try {
      const promptEmail = prompt("Simulação de Login Google - Digite seu e-mail do Google:", "helpus.ecommerce@gmail.com");
      if (!promptEmail) return;

      const res = await loginWithGoogle({
        email: promptEmail,
        name: promptEmail.split("@")[0],
        picture: "https://lh3.googleusercontent.com/a/default-user"
      });

      const role = res.user.roleCode || res.user.role;
      if (role === "DEVELOPER" || role === "STORE_OWNER" || role === "OPERATOR") {
        navigate("/admin");
      } else {
        navigate("/minha-conta");
      }
    } catch (err) {
      setErro("Falha no login com o Google.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-helpusOrange/15 text-helpusOrange text-2xl font-bold mb-1">
            🔑
          </div>
          <h1 className="text-2xl font-extrabold text-white">Acessar Plataforma</h1>
          <p className="text-neutral-400 text-xs">
            Entre para gerenciar seus orçamentos de locação ou acesse seu painel operacional.
          </p>
        </div>

        {erro && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
            {erro}
          </div>
        )}

        {/* Botão Oficial do Google */}
        <button
          type="button"
          onClick={handleSimularGoogle}
          className="w-full py-3 px-4 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-3 border border-neutral-300"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Entrar com o Google</span>
        </button>

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
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-helpusOrange"
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
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-helpusOrange"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>

        <div className="border-t border-neutral-800 pt-4 text-center text-xs text-neutral-400 space-y-2">
          <div>
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="text-helpusOrange font-bold hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </div>
          <div className="text-[11px] text-neutral-500 pt-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-left space-y-1">
            <div className="font-bold text-neutral-300">🔑 Credenciais de Acesso Pré-Cadastradas:</div>
            <div>• 👑 Dev SuperAdmin: <code className="text-emerald-400">helpus.ecommerce@gmail.com</code> / <code className="text-emerald-400">@dmLocal1993</code></div>
            <div>• 🏬 Gerente Loja: <code className="text-emerald-400">gerente@plurallocacoes.com.br</code> / <code className="text-emerald-400">gerente123</code></div>
            <div>• 🛠️ Operador: <code className="text-emerald-400">operador@plurallocacoes.com.br</code> / <code className="text-emerald-400">operador123</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
