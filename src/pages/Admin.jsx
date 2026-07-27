import React, { useState } from "react";
import { useProducts } from "../context/ProductContext.jsx";

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefault } = useProducts();

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  // Form State
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("mesas");
  const [precoDiaria, setPrecoDiaria] = useState("");
  const [imagem, setImagem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [destaque, setDestaque] = useState("");
  const [estoque, setEstoque] = useState("50");

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const abrirModalCriar = () => {
    setProdutoEditando(null);
    setNome("");
    setCategoria("mesas");
    setPrecoDiaria("");
    setImagem("/mesas-e-cadeiras-01.jpeg");
    setDescricao("");
    setDestaque("");
    setEstoque("50");
    setModalAberto(true);
  };

  const abrirModalEditar = (prod) => {
    setProdutoEditando(prod);
    setNome(prod.nome);
    setCategoria(prod.categoria || "mesas");
    setPrecoDiaria(prod.precoDiaria.toString());
    setImagem(prod.imagem || "");
    setDescricao(prod.descricao || "");
    setDestaque(prod.destaque || "");
    setEstoque((prod.estoque || 50).toString());
    setModalAberto(true);
  };

  const handleSalvar = (e) => {
    e.preventDefault();

    const dados = {
      nome,
      categoria,
      precoDiaria: parseFloat(precoDiaria) || 0,
      imagem: imagem || "/mesas-e-cadeiras-01.jpeg",
      descricao,
      destaque,
      estoque: parseInt(estoque, 10) || 0,
      opcoesAdicionais: produtoEditando?.opcoesAdicionais || []
    };

    if (produtoEditando) {
      updateProduct(produtoEditando.id, dados);
    } else {
      addProduct(dados);
    }

    setModalAberto(false);
  };

  // Estatísticas
  const totalProdutos = products.length;
  const totalEstoque = products.reduce((acc, p) => acc + (p.estoque || 0), 0);
  const mediaPreco = totalProdutos
    ? products.reduce((acc, p) => acc + (p.precoDiaria || 0), 0) / totalProdutos
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header Admin */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase font-bold text-helpusOrange">Gerenciador de Conteúdo</span>
          <h1 className="text-3xl font-extrabold text-white">Painel Administrativo</h1>
          <p className="text-neutral-400 text-sm">
            Adicione, edite e remova equipamentos do catálogo da Plural Locações em tempo real.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetToDefault}
            className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl transition"
          >
            Restaurar Padrões 🔄
          </button>

          <button
            onClick={abrirModalCriar}
            className="py-2.5 px-5 bg-helpusOrange hover:bg-[#d64a28] text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
          >
            + Novo Produto 📦
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-medium">Equipamentos Cadastrados</span>
          <div className="text-3xl font-black text-white mt-1">{totalProdutos}</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-medium">Estoque Total Disponível</span>
          <div className="text-3xl font-black text-helpusOrange mt-1">{totalEstoque} un</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 font-medium">Valor Médio da Diária</span>
          <div className="text-3xl font-black text-white mt-1">{formatCurrency(mediaPreco)}</div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 font-bold text-white text-sm">
          Lista de Produtos do Catálogo
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço / Diária</th>
                <th className="p-4">Estoque</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-neutral-950/50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={prod.imagem}
                      alt={prod.nome}
                      className="w-10 h-10 object-cover rounded-lg border border-neutral-800"
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{prod.nome}</div>
                      <div className="text-neutral-500 text-[11px] truncate max-w-xs">{prod.destaque || prod.descricao}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 capitalize font-medium">
                      {prod.categoria}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white text-sm">
                    {formatCurrency(prod.precoDiaria)}
                  </td>
                  <td className="p-4 font-medium text-neutral-300">
                    {prod.estoque || 50} un
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => abrirModalEditar(prod)}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja remover o produto "${prod.nome}"?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="px-3 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulário Criar/Editar */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-lg">
                {produtoEditando ? "Editar Produto" : "Novo Produto para Locação"}
              </h3>
              <button onClick={() => setModalAberto(false)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Nome do Equipamento *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Categoria *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange capitalize"
                  >
                    <option value="mesas">Mesas</option>
                    <option value="cadeiras">Cadeiras</option>
                    <option value="conjuntos">Kits & Conjuntos</option>
                    <option value="tendas">Tendas & Coberturas</option>
                    <option value="enxoval">Enxoval & Toalhas</option>
                    <option value="iluminacao">Iluminação & Som</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Preço / Diária (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precoDiaria}
                    onChange={(e) => setPrecoDiaria(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Caminho da Imagem (URL ou /foto.jpg)</label>
                  <input
                    type="text"
                    value={imagem}
                    onChange={(e) => setImagem(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Quantidade em Estoque</label>
                  <input
                    type="number"
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Frase de Destaque / Badge</label>
                <input
                  type="text"
                  placeholder="Ex: Ideal para recepções de casamento"
                  value={destaque}
                  onChange={(e) => setDestaque(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Descrição Detalhada</label>
                <textarea
                  rows="3"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="py-2 px-4 bg-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-helpusOrange text-white rounded-xl hover:bg-[#d64a28] font-bold shadow"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
