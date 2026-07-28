import React, { useState } from "react";
import { useCart, BAIRROS_FRETE } from "../context/CartContext.jsx";
import { useProducts } from "../context/ProductContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Orcamentos() {
  const { products } = useProducts();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const {
    cartItems,
    addToCart,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    diasLocacao,
    bairroSelecionado,
    setBairroSelecionado,
    subtotalLocacao,
    taxaFrete,
    valorTotalEstimado,
    saveOrderToDB,
    clearCart
  } = useCart();

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");

  // Form Cliente
  const [nome, setNome] = useState(user?.name || "");
  const [whatsapp, setWhatsapp] = useState(user?.phone || "");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [enviando, setEnviando] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  const produtosFiltrados = products.filter((p) => {
    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(busca.toLowerCase()));
    const matchCat =
      categoriaFiltro === "todos" ||
      (p.categoria && p.categoria.toLowerCase().includes(categoriaFiltro.toLowerCase()));
    return matchBusca && matchCat;
  });

  const handleFinalizarOrçamentoSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Por favor, adicione pelo menos 1 equipamento ao orçamento antes de enviar!");
      return;
    }

    if (!nome || !whatsapp || !rua) {
      alert("Preencha seu Nome, WhatsApp de Contato e Rua de Entrega.");
      return;
    }

    setEnviando(true);

    const orderPayload = {
      clientName: nome,
      whatsapp,
      startDate: dataInicio,
      endDate: dataFim,
      rentalDays: diasLocacao,
      neighborhood: bairroSelecionado.nome,
      address: `${rua}, Nº ${numero || "S/N"}`,
      notes: observacoes,
      items: cartItems,
      subtotal: subtotalLocacao,
      freightFee: taxaFrete,
      totalPrice: valorTotalEstimado
    };

    try {
      const savedOrder = await saveOrderToDB(orderPayload, token);
      clearCart();
      setEnviando(false);
      navigate("/confirmacao-pedido", { state: { order: savedOrder } });
    } catch (err) {
      console.error("Erro ao registrar orçamento:", err);
      alert("Houve um erro ao registrar o orçamento. Tente novamente.");
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header Orçamentos */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-helpusOrange">
            Cotação Online Instantânea
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Montador Interativo de Orçamento</h1>
          <p className="text-neutral-400 text-sm">
            Monte seu pedido personalizando diárias, endereço de entrega e equipamentos com cálculo automático.
          </p>
        </div>

        {/* Card Contrato Direto WhatsApp */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
            💬
          </div>
          <div>
            <div className="text-xs font-bold text-white">Dúvida ou Atendimento Personalizado?</div>
            <a
              href="https://wa.me/5583999087188?text=Ola%2C%20gostaria%20de%20falar%20diretamente%20com%20um%20atendente%20da%20Plural."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 font-bold hover:underline"
            >
              Falar no WhatsApp Direct →
            </a>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda & Central: Seleção do Acervo & Datas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Passo 1: Datas e Bairro */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <span className="w-6 h-6 rounded-lg bg-helpusOrange text-white text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>Datas do Evento & Localização</span>
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Data de Entrega *</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 font-semibold focus:outline-none focus:border-helpusOrange"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Data de Recolhimento *</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 font-semibold focus:outline-none focus:border-helpusOrange"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Bairro em João Pessoa *</label>
                <select
                  value={bairroSelecionado.nome}
                  onChange={(e) => {
                    const b = BAIRROS_FRETE.find((item) => item.nome === e.target.value);
                    if (b) setBairroSelecionado(b);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 font-bold focus:outline-none focus:border-helpusOrange"
                >
                  {BAIRROS_FRETE.map((b) => (
                    <option key={b.nome} value={b.nome}>
                      {b.nome} ({formatCurrency(b.taxa)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-neutral-950 p-3 rounded-xl flex items-center justify-between text-xs text-neutral-300 border border-neutral-800">
              <span>Período Calculado: <strong className="text-white">{diasLocacao} {diasLocacao === 1 ? 'diária' : 'diárias'}</strong></span>
              <span>Frete Estimado: <strong className="text-emerald-400">{formatCurrency(taxaFrete)}</strong></span>
            </div>
          </div>

          {/* Passo 2: Selecionar Equipamentos */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-helpusOrange text-white text-xs flex items-center justify-center font-black">
                  2
                </span>
                <span>Adicionar Equipamentos ao Orçamento</span>
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar equipamento..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-1.5 text-xs w-44"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {produtosFiltrados.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex gap-3 items-center hover:border-neutral-700 transition"
                >
                  <img
                    src={prod.imagem}
                    alt={prod.nome}
                    className="w-16 h-16 object-cover rounded-lg border border-neutral-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10px] text-helpusOrange font-bold">{prod.sku}</div>
                    <h4 className="font-bold text-white text-xs truncate">{prod.nome}</h4>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">
                      {formatCurrency(prod.precoDiaria)} <span className="text-[10px] text-neutral-500 font-normal">/ diária</span>
                    </div>
                    <button
                      onClick={() => addToCart(prod, 1, [])}
                      className="mt-2 py-1 px-3 bg-helpusOrange/20 hover:bg-helpusOrange text-helpusOrange hover:text-white border border-helpusOrange/40 font-bold text-[11px] rounded-lg transition w-full"
                    >
                      + Incluir no Orçamento
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Resumo do Orçamento & Envio Oficial */}
        <div className="space-y-6">
          <form
            onSubmit={handleFinalizarOrçamentoSubmit}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl sticky top-24"
          >
            <h3 className="font-bold text-lg text-white border-b border-neutral-800 pb-3 flex items-center justify-between">
              <span>📋 Resumo da Cotação</span>
              <span className="text-xs bg-helpusOrange/15 text-helpusOrange px-2.5 py-0.5 rounded font-bold">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
              </span>
            </h3>

            {/* Lista de Itens Adicionados */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="text-center py-6 text-neutral-500 text-xs">
                  Nenhum equipamento adicionado ainda. Escolha os produtos ao lado!
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.itemKey}
                    className="flex justify-between items-center bg-neutral-950 p-2 rounded-xl text-xs border border-neutral-800"
                  >
                    <div>
                      <div className="font-bold text-white">{item.quantidade}x {item.product.nome || item.product.name}</div>
                      <div className="text-[10px] text-neutral-400">{formatCurrency(item.precoUnitarioDiaria)} / diária</div>
                    </div>
                    <div className="font-bold text-helpusOrange">
                      {formatCurrency(item.precoUnitarioDiaria * item.quantidade * diasLocacao)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Dados de Contato do Cliente */}
            <div className="space-y-3 pt-3 border-t border-neutral-800 text-xs">
              <h4 className="font-bold text-neutral-300 uppercase tracking-wider">Passo 3: Seus Dados para Emissão:</h4>

              <div>
                <label className="block text-neutral-400 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Wagner Santos"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">WhatsApp de Contato *</label>
                <input
                  type="tel"
                  required
                  placeholder="(83) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-neutral-400 mb-1">Rua / Av *</label>
                  <input
                    type="text"
                    required
                    placeholder="Rua da Entrega"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Nº</label>
                  <input
                    type="text"
                    placeholder="120"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Observações do Evento</label>
                <textarea
                  rows="2"
                  placeholder="Horário de preferência, etc."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>

            {/* Totais do Orçamento */}
            <div className="space-y-1.5 pt-3 border-t border-neutral-800 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal ({diasLocacao}d):</span>
                <span className="text-white font-semibold">{formatCurrency(subtotalLocacao)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Frete ({bairroSelecionado.nome}):</span>
                <span className="text-white font-semibold">{formatCurrency(taxaFrete)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-neutral-800">
                <span>Total Estimado:</span>
                <span className="text-helpusOrange">{formatCurrency(valorTotalEstimado)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando || cartItems.length === 0}
              className="w-full py-3.5 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{enviando ? "Processando Orçamento..." : "⚡ Concluir e Enviar Orçamento"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
