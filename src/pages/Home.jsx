import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import logo from "/logo-plural.jpg";
import julio from "/julio-foto.png";
import videoBg from "/video01.mp4";

export default function Home() {
  const { products } = useProducts();
  const { addToCart } = useCart();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  // Produtos Destaques para a Home
  const destaquesCategorias = products.slice(0, 6);

  const diferenciais = [
    {
      icone: "👑",
      titulo: "Mobiliário Nobre & Higienizado",
      descricao: "Cadeiras Tiffany, Dior cristal, Paris amadeirada e bistrôs 100% revisados e sanitizados a cada evento."
    },
    {
      icone: "🚚",
      titulo: "Entrega Pontual com Frota Própria",
      descricao: "Logística especializada atendendo todos os bairros de João Pessoa, Cabedelo, Conde e região."
    },
    {
      icone: "📜",
      titulo: "Contrato A4 & Sinal 30% PIX",
      descricao: "Emissão oficial de Proposta Comercial, Orçamento em PDF, Contrato registrado e Recibo com quitação."
    },
    {
      icone: "⛺",
      titulo: "Montagem de Estruturas Inclusa",
      descricao: "Nossa equipe técnica cuida do descarregamento, montagem de tendas, pistas e climatizadores no local."
    }
  ];

  const depoimentos = [
    {
      nome: "Mariana Alencar",
      tipo: "Cerimonialista de Casamentos",
      texto: "A Plural Locações salvou nosso casamento na praia em Cabo Branco! As cadeiras Tiffany douradas e a tenda cristal chegaram impecáveis e a montagem foi ultra rápida.",
      estrelas: "⭐⭐⭐⭐⭐"
    },
    {
      nome: "Carlos Eduardo",
      tipo: "Organizador de Congressos & Feiras",
      texto: "Alugamos 300 cadeiras bistrô e climatizadores industriais para nossa convenção. Pontualidade britânica e notas/contratos emitidos perfeitamente.",
      estrelas: "⭐⭐⭐⭐⭐"
    },
    {
      nome: "Fernanda Gouveia",
      tipo: "Aniversário de 15 Anos em Tambaú",
      texto: "O kit de mesas bistrô de vidro com refletores LED deixou nosso lounge de fotos maravilhoso. Atendimento rápido pelo WhatsApp e site excelente!",
      estrelas: "⭐⭐⭐⭐⭐"
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* ===== HERO IMPACTANTE COM VÍDEO & GRADIENTE GLASSMORPHISM ===== */}
      <section
        className="relative min-h-[92dvh] w-full overflow-hidden bg-black text-white flex items-center pt-8"
        aria-label="Apresentação Plural Locações"
      >
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-50 scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40" />

        <div className="relative z-10 w-11/12 max-w-7xl mx-auto py-12">
          <div className="grid items-center gap-10 lg:grid-cols-12 animate-fadeIn">
            {/* Texto Hero */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-helpusOrange/20 border border-helpusOrange/40 text-helpusOrange text-xs font-black tracking-wider uppercase backdrop-blur-md">
                <span>⭐ A Estrutura Líder para Eventos em João Pessoa</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white tracking-tight drop-shadow-xl">
                Transforme seu Evento com <span className="text-helpusOrange">Mobiliário de Alto Padrão</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed drop-shadow">
                Locação de Cadeiras Tiffany, Dior Cristal, Mesas Redondas de Banquetes, Tendas Piramidais, Climatizadores e Enxoval completo com montagem pontual em João Pessoa e região.
              </p>

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/orcamentos"
                  className="px-7 py-4 rounded-2xl text-sm font-black bg-helpusOrange hover:bg-[#d64a28] text-white shadow-xl shadow-helpusOrange/20 transition-transform duration-300 hover:scale-[1.03] flex items-center gap-2"
                >
                  <span>⚡ Fazer Cotação Instantânea</span>
                </Link>

                <Link
                  to="/catalogo"
                  className="px-7 py-4 rounded-2xl text-sm font-bold bg-neutral-900/90 hover:bg-neutral-800 text-white backdrop-blur ring-1 ring-neutral-700 transition"
                >
                  📦 Explorar Acervo (28+ Itens)
                </Link>
              </div>

              {/* Badges de Confiança */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-800/80 text-xs text-neutral-400">
                <div>
                  <div className="text-lg font-black text-white font-mono">+1.200</div>
                  <div>Eventos Realizados</div>
                </div>
                <div>
                  <div className="text-lg font-black text-emerald-400 font-mono">100%</div>
                  <div>Higienizado & Novo</div>
                </div>
                <div>
                  <div className="text-lg font-black text-helpusOrange font-mono">24h</div>
                  <div>Suporte no Evento</div>
                </div>
              </div>
            </div>

            {/* Bloco Visual de Destaque */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-helpusOrange to-amber-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <img
                  src={julio}
                  alt="Júlio — Gerente Plural Locações"
                  className="relative w-64 sm:w-72 lg:w-80 rounded-2xl border-2 border-neutral-700 shadow-2xl object-cover"
                />
              </div>

              <div className="bg-neutral-900/90 backdrop-blur border border-neutral-800 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-neutral-300 max-w-xs shadow-xl">
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <div className="font-bold text-white">Plural Locações</div>
                  <div className="text-[10px] text-neutral-400">Atendimento personalizado com orçamentos em PDF no ato.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESTAQUES DO ACERVO (PRODUTOS MAIS PEDIDOS) ===== */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-helpusOrange">
              Seleção Especial de Locação
            </span>
            <h2 className="text-3xl font-black text-white mt-1">Os Favoritos para Casamentos e Recepções</h2>
          </div>
          <Link to="/catalogo" className="text-xs font-bold text-helpusOrange hover:underline">
            Ver Todos os 28 Equipamentos →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destaquesCategorias.map((prod) => (
            <div
              key={prod.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl hover:border-neutral-700 transition flex flex-col group"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-neutral-950">
                <img
                  src={prod.imagem}
                  alt={prod.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {prod.destaque && (
                  <span className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur text-helpusOrange border border-helpusOrange/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                    {prod.destaque}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="font-mono text-[10px] text-helpusOrange font-bold">{prod.sku}</div>
                  <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">{prod.nome}</h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {prod.descricao}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Valor por Diária</span>
                    <span className="text-lg font-black text-emerald-400">{formatCurrency(prod.precoDiaria)}</span>
                  </div>

                  <button
                    onClick={() => addToCart(prod, 1, [])}
                    className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white text-xs font-bold rounded-xl shadow transition transform hover:scale-[1.02]"
                  >
                    + Cotar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DIFERENCIAIS COMPETITIVOS ===== */}
      <section className="bg-neutral-900/60 border-y border-neutral-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-extrabold tracking-widest text-helpusOrange">
              Por que a Plural Locações?
            </span>
            <h2 className="text-3xl font-black text-white">Excelência em Cada Detalhe do Seu Evento</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((dif, idx) => (
              <div
                key={idx}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3 hover:border-helpusOrange/40 transition shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-helpusOrange/15 text-helpusOrange font-bold text-2xl flex items-center justify-center border border-helpusOrange/30">
                  {dif.icone}
                </div>
                <h3 className="font-bold text-white text-base">{dif.titulo}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{dif.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS DE CLIENTES (PROVA SOCIAL) ===== */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-widest text-helpusOrange">
            Avaliações Reais
          </span>
          <h2 className="text-3xl font-black text-white">Quem Aluga com a Plural Recomenda</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {depoimentos.map((dep, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="text-sm">{dep.estrelas}</div>
                <p className="text-xs text-neutral-300 leading-relaxed italic">"{dep.texto}"</p>
              </div>
              <div className="pt-3 border-t border-neutral-800">
                <div className="font-bold text-white text-xs">{dep.nome}</div>
                <div className="text-[10px] text-helpusOrange font-semibold">{dep.tipo}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER FINAL ===== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-black border border-neutral-800 rounded-3xl p-8 lg:p-12 flex flex-wrap items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-black text-helpusOrange uppercase tracking-widest">
              Garantia de Data & Estoque
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Solicite seu Orçamento Comercial Oficial em Poucos Segundos
            </h2>
            <p className="text-neutral-400 text-sm">
              Selecione as diárias, o bairro em João Pessoa e receba sua proposta com cálculo transparente e sinal PIX de 30%.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/orcamentos"
              className="py-4 px-8 bg-helpusOrange hover:bg-[#d64a28] text-white font-black text-sm rounded-2xl shadow-xl transition transform hover:scale-[1.02]"
            >
              Montar Orçamento Agora ⚡
            </Link>
            <a
              href="https://wa.me/5583999087188?text=Ola%2C%20gostaria%20de%20solicitar%20um%20orcamento."
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-8 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm rounded-2xl border border-neutral-700 transition"
            >
              Falar no WhatsApp 📲
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
