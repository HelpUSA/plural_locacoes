import React, { useState, useMemo } from "react";
import { useProducts } from "../context/ProductContext.jsx";
import ProductModal from "../components/ProductModal.jsx";
import HelpTooltip from "../components/HelpTooltip.jsx";

export default function Catalogo() {
  const { products, loading } = useProducts();

  const [departamentoAtivo, setDepartamentoAtivo] = useState("todos");
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [apenasKits, setApenasKits] = useState(false);
  const [busca, setBusca] = useState("");
  const [produtoModal, setProdutoModal] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  // Lista dinâmica de todas as categorias existentes no acervo com contagem de produtos
  const listaCategoriasDinamicas = useMemo(() => {
    const contagem = {};
    products.forEach((p) => {
      const cat = p.categoriaName || p.categoria || "Outros";
      contagem[cat] = (contagem[cat] || 0) + 1;
    });

    return Object.keys(contagem).map((catKey) => ({
      key: catKey,
      label: catKey.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      count: contagem[catKey]
    }));
  }, [products]);

  // Filtragem Inteligente dos Produtos
  const produtosFiltrados = useMemo(() => {
    return products.filter((prod) => {
      // 1. Filtro por Departamento
      if (departamentoAtivo !== "todos") {
        if (prod.departamento !== departamentoAtivo) return false;
      }

      // 2. Filtro por Categoria Específica
      if (categoriaAtiva !== "todos") {
        const catProd = (prod.categoriaName || prod.categoria || "").toLowerCase();
        const catFiltro = categoriaAtiva.toLowerCase();

        if (catFiltro === "cadeiras") {
          if (!catProd.includes("cadeira") && !catProd.includes("assento")) return false;
        } else if (catFiltro === "mesas") {
          if (!catProd.includes("mesa") && !catProd.includes("bancada")) return false;
        } else if (catFiltro === "tendas") {
          if (!catProd.includes("tenda") && !catProd.includes("cobertura") && !catProd.includes("estrutura")) return false;
        } else {
          if (!catProd.includes(catFiltro)) return false;
        }
      }

      // 3. Filtro Apenas Kits
      if (apenasKits && !prod.isKit) {
        return false;
      }

      // 4. Busca Livre (Nome, SKU, Cor, Material, Descrição)
      if (busca.trim() !== "") {
        const termo = busca.toLowerCase();
        const bateNome = prod.nome.toLowerCase().includes(termo);
        const bateSku = (prod.sku || "").toLowerCase().includes(termo);
        const bateDesc = (prod.descricao || "").toLowerCase().includes(termo);
        const bateMaterial = (prod.material || "").toLowerCase().includes(termo);
        const bateCor = (prod.cor || "").toLowerCase().includes(termo);
        return bateNome || bateSku || bateDesc || bateMaterial || bateCor;
      }

      return true;
    });
  }, [products, departamentoAtivo, categoriaAtiva, apenasKits, busca]);

  // Agrupamento por Categoria para exibição em Seções Organizadas
  const produtosAgrupadosPorCategoria = useMemo(() => {
    const grupos = {};
    produtosFiltrados.forEach((prod) => {
      const cat = prod.categoriaName || prod.categoria || "Equipamentos Gerais";
      if (!grupos[cat]) {
        grupos[cat] = [];
      }
      grupos[cat].push(prod);
    });
    return grupos;
  }, [produtosFiltrados]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header do Catálogo */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-widest text-helpusOrange">
          Catálogo Corporativo & Acervo
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center gap-2">
          <span>Móveis, Tendas & Estruturas para Eventos</span>
          <HelpTooltip
            titulo="Como Usar o Catálogo"
            explicacao="Navegue pelo acervo de equipamentos da Plural Locações, veja especificações técnicas de cada item e monte seu orçamento."
            passos={[
              "Use os filtros de departamentos para separar por Mobiliário, Coberturas ou Climatização",
              "Clique em qualquer equipamento para ver dimensões, peso suportado e fotos de alta resolução",
              "Adicione os itens desejados ao carrinho ou use o Assistente Guiado"
            ]}
            dica="Caso prefira que o sistema sugira a quantidade de mobília conforme seus convidados, clique em '⚡ Faça Seu Orçamento'."
          />
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Selecione os equipamentos por departamento, confira as especificações técnicas e adicione ao seu carrinho de locação.
        </p>
      </div>

      {/* Navegação por Departamentos (Abas Superiores) */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-neutral-800 pb-4">
        <button
          onClick={() => { setDepartamentoAtivo("todos"); setCategoriaAtiva("todos"); setApenasKits(false); }}
          className={`py-2.5 px-5 text-xs font-bold rounded-xl transition ${
            departamentoAtivo === "todos" && !apenasKits
              ? "bg-helpusOrange text-white shadow-lg"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          🌟 Todo o Acervo ({products.length})
        </button>

        <button
          onClick={() => { setDepartamentoAtivo("mobiliario-lounges"); setCategoriaAtiva("todos"); setApenasKits(false); }}
          className={`py-2.5 px-5 text-xs font-bold rounded-xl transition ${
            departamentoAtivo === "mobiliario-lounges"
              ? "bg-helpusOrange text-white shadow-lg"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          🪑 Mobiliário & Lounges
        </button>

        <button
          onClick={() => { setDepartamentoAtivo("coberturas-estruturas"); setCategoriaAtiva("todos"); setApenasKits(false); }}
          className={`py-2.5 px-5 text-xs font-bold rounded-xl transition ${
            departamentoAtivo === "coberturas-estruturas"
              ? "bg-helpusOrange text-white shadow-lg"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          ⛺ Coberturas & Tendas
        </button>

        <button
          onClick={() => { setDepartamentoAtivo("climatizacao-iluminacao"); setCategoriaAtiva("todos"); setApenasKits(false); }}
          className={`py-2.5 px-5 text-xs font-bold rounded-xl transition ${
            departamentoAtivo === "climatizacao-iluminacao"
              ? "bg-helpusOrange text-white shadow-lg"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          ❄️ Climatização & Iluminação
        </button>

        <button
          onClick={() => { setApenasKits(true); setDepartamentoAtivo("todos"); setCategoriaAtiva("todos"); }}
          className={`py-2.5 px-5 text-xs font-bold rounded-xl transition ${
            apenasKits
              ? "bg-helpusOrange text-white shadow-lg"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          🎁 Kits & Combos Prontos
        </button>
      </div>

      {/* Barra de Filtros por Categoria & Busca por Nome/SKU */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Seletor de Categoria Específica */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
            Filtro:
          </span>
          <button
            onClick={() => setCategoriaAtiva("todos")}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              categoriaAtiva === "todos"
                ? "bg-neutral-800 text-helpusOrange font-bold border border-helpusOrange/40"
                : "text-neutral-400 hover:text-white bg-neutral-950/60"
            }`}
          >
            Todas ({produtosFiltrados.length})
          </button>
          {listaCategoriasDinamicas.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoriaAtiva(cat.key)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                categoriaAtiva === cat.key
                  ? "bg-neutral-800 text-helpusOrange font-bold border border-helpusOrange/40"
                  : "text-neutral-400 hover:text-white bg-neutral-950/60"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Input de Busca Livre */}
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Buscar por nome, SKU ou material..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-helpusOrange"
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              className="absolute right-3 top-2 text-neutral-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Exibição dos Produtos Agrupados por Seção */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-2 border-helpusOrange border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-400 text-xs">Carregando acervo corporativo da Plural...</p>
        </div>
      ) : Object.keys(produtosAgrupadosPorCategoria).length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center space-y-4">
          <div className="text-5xl opacity-40">🔍</div>
          <h3 className="font-bold text-white text-lg">Nenhum equipamento encontrado</h3>
          <p className="text-neutral-400 text-xs max-w-md mx-auto">
            Não encontramos nenhum produto correspondente aos filtros selecionados. Tente limpar a busca ou selecionar outro departamento.
          </p>
          <button
            onClick={() => { setDepartamentoAtivo("todos"); setCategoriaAtiva("todos"); setBusca(""); setApenasKits(false); }}
            className="py-2.5 px-6 bg-helpusOrange text-white font-bold text-xs rounded-xl hover:bg-[#d64a28] transition shadow"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(produtosAgrupadosPorCategoria).map(([nomeCategoria, prods]) => (
            <div key={nomeCategoria} className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-helpusOrange"></span>
                  <h2 className="text-xl font-extrabold text-white">{nomeCategoria}</h2>
                  <span className="text-xs text-neutral-500 font-mono">({prods.length} {prods.length === 1 ? 'item' : 'itens'})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prods.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl hover:border-neutral-700 transition flex flex-col justify-between group"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden bg-neutral-950 cursor-pointer" onClick={() => setProdutoModal(prod)}>
                      <img
                        src={prod.imagem}
                        alt={prod.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur text-helpusOrange border border-helpusOrange/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full font-mono">
                        {prod.sku}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-white line-clamp-1 cursor-pointer hover:text-helpusOrange transition" onClick={() => setProdutoModal(prod)}>
                          {prod.nome}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {prod.descricao}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Valor Diária</span>
                          <span className="text-lg font-black text-emerald-400">{formatCurrency(prod.precoDiaria)}</span>
                        </div>

                        <button
                          onClick={() => setProdutoModal(prod)}
                          className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white text-xs font-bold rounded-xl shadow transition transform hover:scale-[1.02]"
                        >
                          Ver Detalhes 🔍
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes Técnicos e Inclusão no Orçamento */}
      {produtoModal && (
        <ProductModal
          product={produtoModal}
          onClose={() => setProdutoModal(null)}
        />
      )}
    </div>
  );
}
