// 📄 src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "/logo-plural.jpg";
import julio from "/julio-foto.png";
import videoBg from "/video01.mp4";

export default function Home() {
  const produtos = [
    {
      id: "mesa-redonda",
      titulo: "Mesa Redonda com Tampo",
      preco: "R$ 40 /un",
      imagem: "/mesas-e-cadeiras-01.jpeg",
      items: [
        { nome: "Cadeira de plástico com capa", valor: "R$ 10 /un" },
        { nome: "Toalha branca (até o chão)", valor: "R$ 30 /un" },
        { nome: "Cobre-mancha champanhe", valor: "R$ 20 /un" },
      ],
      destaque: "Combinação elegante para casamentos e aniversários.",
    },
    {
      id: "conjunto-praia",
      titulo: "Conjunto de Mesa com 4 Cadeiras",
      preco: "R$ 20,00 /conjunto",
      imagem: "/mesas-e-cadeiras-02.jpeg",
      items: [
        { nome: "Mesa quadrada plástica", valor: "Inclusa" },
        { nome: "4 cadeiras plásticas", valor: "Inclusas" },
      ],
      destaque: "Perfeito para praia, churrascos e eventos casuais.",
    },
    {
      id: "mesa-retangular",
      titulo: "Mesa Retangular com Tampo",
      preco: "R$ 40 /un",
      imagem: "/mesas-e-cadeiras-03.jpeg",
      items: [
        { nome: "Cadeira de plástico com capa", valor: "R$ 10 /un" },
        { nome: "Toalha branca (até o chão)", valor: "R$ 30 /un" },
        { nome: "Caminho de mesa champanhe", valor: "R$ 20 /un" },
      ],
      destaque: "Versátil para buffet, coffee break e mesas comunitárias.",
    },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="
          relative min-h-[100dvh] pt-16
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

        {/* Sobreposição com gradiente */}
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
                Locação de mesas, cadeiras, tendas, iluminação e muito mais para
                o seu evento ser um sucesso em João Pessoa e região.
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

      {/* ===== CATÁLOGO HOME ===== */}
      <section className="bg-neutral-950 text-neutral-100 py-12 md:py-16">
        <div className="w-11/12 max-w-7xl mx-auto">
          <header className="mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              Mesas, Cadeiras & Enxoval
            </h2>
            <p className="text-neutral-400 mt-2">
              Itens podem ser contratados separadamente ou em conjunto.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {produtos.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl bg-neutral-900/70 border border-neutral-800 overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="aspect-[16/11] overflow-hidden">
                  <img
                    src={p.imagem}
                    alt={p.titulo}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-semibold text-lg">{p.titulo}</h3>
                    <span className="px-2 py-1 text-sm rounded-md bg-helpusOrange/15 text-helpusOrange font-medium">
                      {p.preco}
                    </span>
                  </div>
                  {p.destaque && (
                    <p className="text-sm text-neutral-400 mt-2">{p.destaque}</p>
                  )}
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {p.items.map((i) => (
                      <li
                        key={i.nome}
                        className="flex items-center justify-between border-b border-neutral-800/70 py-1"
                      >
                        <span className="text-neutral-300">{i.nome}</span>
                        <span className="text-neutral-400">{i.valor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Serviços adicionais */}
          <div className="mt-10 md:mt-14 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 md:p-6">
            <h3 className="font-semibold text-lg mb-3">Serviços adicionais</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-neutral-800/70 px-4 py-3">
                <span className="text-neutral-300">
                  Frete urbano (João Pessoa)
                </span>
                <span className="text-neutral-200 font-medium">R$ 120–250</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-neutral-800/70 px-4 py-3">
                <span className="text-neutral-300">Montagem e retirada</span>
                <span className="text-neutral-200 font-medium">R$ 250–450</span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-3">
              * Valores de frete variam por bairro. Consulte disponibilidade para
              outras cidades.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-3">
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
              Pedir orçamento no WhatsApp
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
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
