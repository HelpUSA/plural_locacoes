import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Cadastro() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      await register(name, email, password, phone);
      navigate("/minha-conta");
    } catch (err) {
      setErro(err.message || "Erro ao realizar cadastro.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-helpusOrange/15 text-helpusOrange text-2xl font-bold mb-1">
            📝
          </div>
          <h1 className="text-2xl font-extrabold text-white">Criar Nova Conta</h1>
          <p className="text-neutral-400 text-xs">
            Cadastre-se para salvar seus orçamentos de eventos e acompanhar as entregas.
          </p>
        </div>

        {erro && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              placeholder="Seu nome ou nome da empresa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-helpusOrange"
            />
          </div>

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
            <label className="block text-neutral-300 font-semibold mb-1">WhatsApp / Telefone *</label>
            <input
              type="tel"
              required
              placeholder="(83) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-helpusOrange"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Senha *</label>
            <input
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
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
            {loading ? "Cadastrando..." : "Criar Minha Conta"}
          </button>
        </form>

        <div className="border-t border-neutral-800 pt-4 text-center text-xs text-neutral-400">
          Já possui conta?{" "}
          <Link to="/login" className="text-helpusOrange font-bold hover:underline">
            Faça login aqui
          </Link>
        </div>
      </div>
    </div>
  );
}
