import React, { useState, useMemo } from "react";
import { useProducts } from "../context/ProductContext.jsx";
import ProductModal from "../components/ProductModal.jsx";

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
        const depProd = (prod.departamento || "").toLowerCase();
        if (!depProd.includes(departamentoAtivo.toLowerCase())) {
          return false;
        }
      }

      // 2. Filtro por Categoria (Fuzzy + Exato)
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

  // Agrupamento dos Produtos por Categoria para Exibição
  const produtosAgrupados = useMemo(() => {
    const grupos = {};
    produtosFiltrados.forEach((prod) => {
      const cat = prod.categoriaName || prod.categoria || "Geral";
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
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Móveis, Tendas & Estruturas para Eventos
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
          ✨ Todo o Acervo ({products.length})
        </button>

        <button
          onClick={() => { setDepartamentoAtivo("mobiliario"); setCategoriaAtiva("todos"); setApenasKits(false); }}
          className={`py-2.5 px-5 text-xs font-bold rounded-xl transition ${
            departamentoAtivo === "mobiliario" && !apenasKits
              ? "bg-helpusOrange text-white shadow-lg"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          🪑 Mobiliário & Lounges
        </button>

        <button
          onClick={() => { setDepartamentoAtivo("estruturas"); setCategoriaAtiva("todos"); setApenasKits(false); }}
          className={`py-2.5 px-5 text-xs font-bold rounded-xl transition ${
            departamentoAtivo === "estruturas" && !apenasKits
              ? "bg-helpusOrange text-white shadow-lg"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          ⛺ Estruturas & Climatização
        </button>

        <button
          onClick={() => { setDepartamentoAtivo("todos"); setApenasKits(true); }}
          className={`py-2.5 px-5 text-xs font-bold rounded-xl transition ${
            apenasKits
              ? "bg-helpusOrange text-white shadow-lg"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          🎁 Kits & Ambientes (Combos)
        </button>
      </div>

      {/* Busca e Filtro de Categorias Escalável */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Busca Livre */}
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="🔍 Buscar por nome, SKU, cor ou material..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-helpusOrange"
            />
          </div>

          {/* Seletor Dropdown para grandes volumes de categorias */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">Filtrar Categoria:</span>
            <select
              value={categoriaAtiva}
              onChange={(e) => setCategoriaAtiva(e.target.value)}
              className="w-full md:w-64 bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-helpusOrange"
            >
              <option value="todos">✨ Todas as Categorias ({products.length} itens)</option>
              {listaCategoriasDinamicas.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label} ({cat.count} itens)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chips/Pills em Carrossel Horizontal para Categorias */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-neutral-800/80 scrollbar-thin scrollbar-thumb-neutral-700">
          <span className="text-[11px] text-neutral-500 font-medium whitespace-nowrap pr-1">Atalhos:</span>

          <button
            onClick={() => setCategoriaAtiva("todos")}
            className={`px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition font-bold ${
              categoriaAtiva === "todos"
                ? "bg-helpusOrange text-white border-helpusOrange shadow"
                : "border-neutral-800 text-neutral-400 hover:text-white bg-neutral-950"
            }`}
          >
            Todas
          </button>

          {listaCategoriasDinamicas.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoriaAtiva(cat.key)}
              className={`px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition font-semibold flex items-center gap-1.5 ${
                categoriaAtiva === cat.key
                  ? "bg-helpusOrange text-white border-helpusOrange shadow"
                  : "border-neutral-800 text-neutral-400 hover:text-white bg-neutral-950"
              }`}
            >
              <span>{cat.label}</span>
              <span className="opacity-60 text-[10px] font-mono">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Exibição dos Produtos Agrupados por Categoria */}
      {loading ? (
        <div className="text-center py-16 text-neutral-400 text-sm">Carregando acervo corporativo...</div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400 text-xs space-y-2">
          <div className="text-3xl">🔍</div>
          <div className="font-bold text-white text-base">Nenhum equipamento encontrado</div>
          <p>Tente ajustar os filtros ou o termo de busca.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(produtosAgrupados).map((nomeCategoria) => (
            <div key={nomeCategoria} className="space-y-4">
              {/* Título da Categoria */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-helpusOrange"></span>
                  <h2 className="text-xl font-bold text-white tracking-wide capitalize">
                    {nomeCategoria.replace(/-/g, ' ')}
                  </h2>
                  <span className="text-xs text-neutral-500 font-mono font-bold">
                    ({produtosAgrupados[nomeCategoria].length} itens)
                  </span>
                </div>

                <button
                  onClick={() => setCategoriaAtiva(nomeCategoria)}
                  className="text-xs text-helpusOrange font-bold hover:underline"
                >
                  Ver apenas esta categoria →
                </button>
              </div>

              {/* Grid de Cards da Categoria */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtosAgrupados[nomeCategoria].map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl hover:border-neutral-700 transition flex flex-col justify-between group"
                  >
                    <div>
                      {/* Imagem do Produto */}
                      <div className="aspect-video w-full bg-neutral-950 overflow-hidden relative border-b border-neutral-800">
                        <img
                          src={prod.imagem}
                          alt={prod.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {prod.isKit && (
                          <span className="absolute top-3 left-3 bg-helpusOrange text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md shadow">
                            🎁 Kit Combo
                          </span>
                        )}
                        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-700">
                          {prod.sku || "SKU"}
                        </span>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-5 space-y-3">
                        {prod.destaque && (
                          <span className="text-[11px] text-helpusOrange font-bold block truncate">
                            {prod.destaque}
                          </span>
                        )}
                        <h3 className="font-bold text-white text-base leading-snug group-hover:text-helpusOrange transition">
                          {prod.nome}
                        </h3>
                        <p className="text-neutral-400 text-xs line-clamp-2">{prod.descricao}</p>

                        {/* Especificações resumidas */}
                        <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400 pt-1">
                          {prod.dimensoes && <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">📐 {prod.dimensoes}</span>}
                          {prod.cor && <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">🎨 {prod.cor}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Rodapé e Preço */}
                    <div className="p-5 pt-0 border-t border-neutral-800/60 mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-500 block font-medium">Diária a partir de:</span>
                        <span className="text-xl font-black text-white">
                          {formatCurrency(prod.precoDiaria)}
                        </span>
                      </div>

                      <button
                        onClick={() => setProdutoModal(prod)}
                        className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow transition"
                      >
                        Ver Ficha Técnica
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes do Produto */}
      {produtoModal && (
        <ProductModal
          product={produtoModal}
          onClose={() => setProdutoModal(null)}
        />
      )}
    </div>
  );
}
