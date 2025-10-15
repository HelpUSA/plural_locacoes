// 📄 src/ui/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-sm text-neutral-300">
      {/* Grid principal */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-10 animate-fadeIn">
        {/* Coluna 1: Identidade */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/logo-plural-64.png"
              alt="Plural Locações"
              className="h-10 w-10 rounded-md"
            />
            <div>
              <p className="font-semibold text-white">Plural Locações</p>
              <p className="text-xs text-neutral-400 -mt-1">Festas & Eventos</p>
            </div>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Aluguel de mesas, cadeiras, tendas, iluminação e muito mais. Atendemos
            João Pessoa e região com qualidade e pontualidade.
          </p>
        </div>

        {/* Coluna 2: Contato */}
        <div>
          <p className="font-semibold mb-3 text-white">Contato</p>
          <ul className="space-y-2 text-sm">
            <li>
              WhatsApp:{" "}
              <a
                className="text-helpusOrange hover:underline"
                href="https://wa.me/5583999087188"
                target="_blank"
                rel="noopener noreferrer"
              >
                +55 83 99908-7188
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a
                className="text-helpusOrange hover:underline"
                href="https://instagram.com/plural_locacoes"
                target="_blank"
                rel="noopener noreferrer"
              >
                /plural_locacoes
              </a>
            </li>
            <li>Endereço: Parque Solon de Lucena, 142 – Sala 105 – João Pessoa/PB</li>
          </ul>
        </div>

        {/* Coluna 3: Links */}
        <div>
          <p className="font-semibold mb-3 text-white">Links</p>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-helpusOrange" href="/catalogo">Catálogo</a></li>
            <li><a className="hover:text-helpusOrange" href="/orcamentos">Orçamentos</a></li>
            <li><a className="hover:text-helpusOrange" href="/como-funciona">Como funciona</a></li>
            <li><a className="hover:text-helpusOrange" href="/contato">Contato</a></li>
          </ul>
        </div>

        {/* Coluna 4: Horário */}
        <div>
          <p className="font-semibold mb-3 text-white">Horário</p>
          <p className="text-sm text-neutral-400">
            Segunda a Sábado: 08h às 18h<br />Domingo: fechado
          </p>
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
