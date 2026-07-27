import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const res = await login(email, password);
      if (res.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/minha-conta");
      }
    } catch (err) {
      setErro(err.message || "E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-helpusOrange/15 text-helpusOrange text-2xl font-bold mb-1">
            🔑
          </div>
          <h1 className="text-2xl font-extrabold text-white">Acessar Conta</h1>
          <p className="text-neutral-400 text-xs">
            Entre para gerenciar seus orçamentos de locação e acompanhar o status dos seus pedidos.
          </p>
        </div>

        {erro && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
            {erro}
          </div>
        )}

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
          <div className="text-[11px] text-neutral-500 pt-2">
            💡 Dica: Para testar o painel admin, use qualquer email com <code className="text-neutral-300 bg-neutral-950 px-1 py-0.5 rounded">admin</code> (ex: admin@plural.com).
          </div>
        </div>
      </div>
    </div>
  );
}
