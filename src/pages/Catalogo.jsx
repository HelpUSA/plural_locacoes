import React, { useState, useMemo } from "react";
import { useProducts } from "../context/ProductContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import ProductModal from "../components/ProductModal.jsx";
import SimuladorFrete from "../components/SimuladorFrete.jsx";

export default function Catalogo() {
  const { products } = useProducts();
  const { addItem } = useCart();
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("relevancia");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const categorias = [
    { id: "todos", nome: "Todos os Itens" },
    { id: "mesas", nome: "Mesas" },
    { id: "cadeiras", nome: "Cadeiras" },
    { id: "conjuntos", nome: "Kits & Conjuntos" },
    { id: "tendas", nome: "Tendas & Coberturas" }
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const produtosFiltrados = useMemo(() => {
    return products
      .filter((p) => {
        const bateCategoria =
          categoriaAtiva === "todos" ||
          (p.categoria && p.categoria.toLowerCase() === categoriaAtiva.toLowerCase());
        const bateBusca =
          !busca ||
          p.nome.toLowerCase().includes(busca.toLowerCase()) ||
          (p.descricao && p.descricao.toLowerCase().includes(busca.toLowerCase()));
        return bateCategoria && bateBusca;
      })
      .sort((a, b) => {
        if (ordenacao === "menor-preco") return a.precoDiaria - b.precoDiaria;
        if (ordenacao === "maior-preco") return b.precoDiaria - a.precoDiaria;
        if (ordenacao === "nome") return a.nome.localeCompare(b.nome);
        return 0;
      });
  }, [products, categoriaAtiva, busca, ordenacao]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header do Catálogo */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-helpusOrange">
          Locação de Equipamentos para Eventos
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Catálogo Completo</h1>
        <p className="text-neutral-400 text-sm max-w-2xl">
          Selecione os equipamentos para a sua festa. Calcule o orçamento com diárias flexíveis e envie o pedido diretamente para nossa equipe no WhatsApp.
        </p>
      </div>

      {/* Barra de Pesquisa, Categorias e Ordenação */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="grid md:grid-cols-3 gap-3">
          {/* Busca por Texto */}
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="🔍 Buscar por mesa, cadeira, tenda, toalha..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-helpusOrange placeholder:text-neutral-500"
            />
            {busca && (
              <button
                onClick={() => setBusca("")}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Ordenação */}
          <div>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-helpusOrange"
            >
              <option value="relevancia">Destaques</option>
              <option value="menor-preco">Menor Preço</option>
              <option value="maior-preco">Maior Preço</option>
              <option value="nome">Nome (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Badges de Categorias */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80">
          {categorias.map((cat) => {
            const active = categoriaAtiva === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  active
                    ? "bg-helpusOrange text-white shadow-md"
                    : "bg-neutral-950 text-neutral-300 border border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {cat.nome}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Produtos */}
      {produtosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 border border-neutral-800 rounded-2xl space-y-3">
          <div className="text-4xl opacity-30">🔍</div>
          <h3 className="text-lg font-bold text-white">Nenhum equipamento encontrado</h3>
          <p className="text-neutral-400 text-sm">
            Tente pesquisar por outro termo ou selecione uma categoria diferente.
          </p>
          <button
            onClick={() => {
              setBusca("");
              setCategoriaAtiva("todos");
            }}
            className="inline-block text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-full font-medium transition"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosFiltrados.map((prod) => (
            <div
              key={prod.id}
              className="bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-neutral-700 hover:shadow-2xl transition flex flex-col justify-between group"
            >
              <div>
                {/* Imagem do Produto */}
                <div
                  className="relative aspect-[4/3] overflow-hidden bg-neutral-950 cursor-pointer"
                  onClick={() => setProdutoSelecionado(prod)}
                >
                  <img
                    src={prod.imagem}
                    alt={prod.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {prod.destaque && (
                    <span className="absolute top-3 left-3 bg-helpusOrange/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      {prod.destaque}
                    </span>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    {prod.categoria}
                  </span>

                  <h3
                    onClick={() => setProdutoSelecionado(prod)}
                    className="font-bold text-base text-white hover:text-helpusOrange transition cursor-pointer line-clamp-1"
                  >
                    {prod.nome}
                  </h3>

                  <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                    {prod.descricao}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-neutral-400">Diária:</span>
                      <div className="text-xl font-extrabold text-white">
                        {formatCurrency(prod.precoDiaria)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="p-4 border-t border-neutral-800/80 flex gap-2">
                <button
                  onClick={() => setProdutoSelecionado(prod)}
                  className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl transition"
                >
                  Detalhes
                </button>
                <button
                  onClick={() => addItem(prod, 1)}
                  className="py-2 px-3 bg-helpusOrange hover:bg-[#d64a28] text-white text-xs font-semibold rounded-xl shadow transition"
                >
                  + Orçamento 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calculadora de Frete na base do catálogo */}
      <div className="pt-6">
        <SimuladorFrete />
      </div>

      {/* Modal de Detalhes do Produto */}
      {produtoSelecionado && (
        <ProductModal
          product={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
        />
      )}
    </div>
  );
}
