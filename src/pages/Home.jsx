// 📄 src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "/logo-plural.jpg";
import julio from "/julio-foto.png";
import videoBg from "/video01.mp4";

export default function Home() {
  return (
    <section
      className="
        relative min-h-[100dvh] pt-16  /* compensa o header sticky h-16 */
        w-full overflow-hidden bg-black text-white
        flex items-center
      "
      aria-label="Apresentação Plural Locações"
    >
      {/* Vídeo de fundo */}
      <video
        src={videoBg}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* Sobreposição com gradiente para legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

      {/* Conteúdo */}
      <div className="relative z-10 w-11/12 max-w-6xl mx-auto">
        <div className="grid items-center gap-8 md:gap-12 md:grid-cols-2 animate-fadeIn">
          {/* Texto */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Equipamentos para Festas e Eventos
            </h1>

            <p className="text-lg md:text-xl text-zinc-200/90 drop-shadow">
              Locação de mesas, cadeiras, tendas, iluminação e muito mais para o
              seu evento ser um sucesso em João Pessoa e região.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/5583999087188"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center
                  px-6 py-3 rounded-full text-base font-semibold
                  bg-helpusOrange hover:bg-[#d64a28]
                  shadow-lg shadow-black/30
                  transition-transform duration-300 hover:scale-[1.03]
                "
              >
                Fale no WhatsApp
              </a>

              <Link
                to="/catalogo"
                className="
                  inline-flex items-center justify-center
                  px-6 py-3 rounded-full text-base font-semibold
                  bg-white/10 hover:bg-white/20 backdrop-blur
                  ring-1 ring-white/30
                  transition-colors
                "
              >
                Ver Catálogo
              </Link>
            </div>
          </div>

          {/* Bloco visual */}
          <div className="flex flex-col items-center md:items-end gap-5 md:gap-6">
            <img
              src={logo}
              alt="Logo Plural Locações"
              loading="eager"
              className="w-40 md:w-52 drop-shadow-lg animate-fadeIn"
              style={{ animationDelay: "100ms" }}
            />

            <img
              src={julio}
              alt="Júlio — Plural Locações"
              loading="lazy"
              className="
                w-56 md:w-64 rounded-2xl border-4 border-white/60
                shadow-2xl transition-transform duration-300 hover:scale-105
                animate-fadeIn
              "
              style={{ animationDelay: "220ms" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
