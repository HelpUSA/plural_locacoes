import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-sm text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10 animate-fadeIn">
        {/* Coluna 1: Identidade */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/logo-plural-64.png"
              alt="Plural Locações"
              className="h-10 w-10 rounded-xl border border-neutral-800 object-cover"
            />
            <div>
              <p className="font-semibold text-white">Plural Locações</p>
              <p className="text-xs text-neutral-400 -mt-1">Móveis & Equipamentos</p>
            </div>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Aluguel de mesas, cadeiras, tendas, iluminação e climatização. Atendemos João Pessoa e região com qualidade e pontualidade.
          </p>
        </div>

        {/* Coluna 2: Contato WhatsApp */}
        <div>
          <p className="font-semibold mb-3 text-white">Atendimento Direto</p>
          <ul className="space-y-2 text-xs">
            <li>
              WhatsApp:{" "}
              <a
                className="text-helpusOrange font-bold hover:underline"
                href="https://wa.me/5583999087188"
                target="_blank"
                rel="noopener noreferrer"
              >
                (83) 99908-7188
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a
                className="text-helpusOrange font-bold hover:underline"
                href="https://instagram.com/plural_locacoes"
                target="_blank"
                rel="noopener noreferrer"
              >
                @plural_locacoes
              </a>
            </li>
            <li className="text-neutral-400">Endereço: Parque Solon de Lucena, 142 – Sala 105 – João Pessoa/PB</li>
          </ul>
        </div>

        {/* Coluna 3: Links Rápidos */}
        <div>
          <p className="font-semibold mb-3 text-white">Navegação Rápida</p>
          <ul className="space-y-2 text-xs">
            <li><Link className="hover:text-helpusOrange transition font-medium" to="/catalogo">📦 Catálogo Completo</Link></li>
            <li><Link className="hover:text-helpusOrange transition font-medium" to="/orcamentos">📋 Cotação Online</Link></li>
            <li><Link className="hover:text-helpusOrange transition font-medium" to="/como-funciona">ℹ️ Como Funciona</Link></li>
          </ul>
        </div>
      </div>

      {/* Linha inferior com crédito HelpUS */}
      <div className="border-t border-neutral-800 py-5 text-center text-xs text-neutral-500">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} Plural Locações. Todos os direitos reservados.</span>
          <a
            href="https://helpusa.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-helpusOrange transition-colors"
          >
            <img
              src="/helpus-icon.png"
              alt="HelpUS — Desenvolvimento Web"
              className="w-5 h-5 rounded-full shadow-sm animate-fadeIn"
              loading="lazy"
            />
            <span>
              Desenvolvido por <strong className="text-white font-semibold">HelpUS</strong>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
