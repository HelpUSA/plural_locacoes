import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const MenuLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3.5 py-2 rounded-xl text-xs font-medium hover:bg-neutral-800 transition ${
        isActive ? "text-helpusOrange font-bold" : "text-neutral-200"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const { totalItensCount, openCart } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-neutral-950/80 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo-plural-64.png"
            alt="Plural Locações"
            className="h-10 w-10 rounded-xl border border-neutral-800 object-cover"
          />
          <div className="leading-tight">
            <p className="font-bold tracking-wide text-white text-base">Plural Locações</p>
            <p className="text-[11px] text-neutral-400">Móveis & Equipamentos</p>
          </div>
        </Link>

        {/* Menu Desktop Enxuto e Focado */}
        <nav className="hidden md:flex items-center gap-2">
          <MenuLink to="/catalogo">Catálogo</MenuLink>
          <MenuLink to="/orcamentos">Orçamentos</MenuLink>
          <MenuLink to="/como-funciona">Como Funciona</MenuLink>
          {isAdmin && <MenuLink to="/admin">Admin ⚙️</MenuLink>}
        </nav>

        {/* Ações (Login/Conta, Carrinho & WhatsApp) */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/minha-conta"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white hover:bg-neutral-800 transition"
              title="Acessar Minha Conta"
            >
              <span className="w-6 h-6 rounded-lg bg-helpusOrange text-white flex items-center justify-center font-bold text-[11px]">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
              <span className="hidden sm:inline line-clamp-1 max-w-[120px]">{user.name}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 transition"
            >
              Entrar 🔑
            </Link>
          )}

          <button
            onClick={openCart}
            className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition flex items-center justify-center"
            title="Abrir carrinho de orçamento"
            aria-label="Carrinho"
          >
            <span className="text-lg">🛒</span>
            {totalItensCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-helpusOrange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItensCount}
              </span>
            )}
          </button>

          <a
            href="https://wa.me/5583999087188?text=Ola%2C%20vim%20pelo%20site%20da%20Plural%20Locacoes%20e%20quero%20um%20orcamento."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-helpusOrange hover:bg-[#d64a28] text-white text-xs font-semibold shadow-md transition-transform hover:scale-[1.02]"
          >
            WhatsApp
          </a>

          {/* Menu Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
          >
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-neutral-200"></span>
              <span className="block h-0.5 w-5 bg-neutral-200"></span>
              <span className="block h-0.5 w-5 bg-neutral-200"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Dropdown Mobile */}
      {open && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 p-4 space-y-2 text-sm text-neutral-200">
          <NavLink to="/catalogo" onClick={() => setOpen(false)} className="block py-2">
            Catálogo
          </NavLink>
          <NavLink to="/orcamentos" onClick={() => setOpen(false)} className="block py-2">
            Orçamentos
          </NavLink>
          <NavLink to="/como-funciona" onClick={() => setOpen(false)} className="block py-2">
            Como Funciona
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/minha-conta" onClick={() => setOpen(false)} className="block py-2 text-helpusOrange font-semibold">
              Minha Conta ({user.name})
            </NavLink>
          ) : (
            <NavLink to="/login" onClick={() => setOpen(false)} className="block py-2 text-helpusOrange font-semibold">
              Entrar / Cadastrar 🔑
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setOpen(false)} className="block py-2 text-helpusOrange font-semibold">
              Painel Admin ⚙️
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
