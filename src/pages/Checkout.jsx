import React, { useState } from "react";
import { useCart, BAIRROS_FRETE } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const {
    cartItems,
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

  const [nome, setNome] = useState(user?.name || "");
  const [whatsapp, setWhatsapp] = useState(user?.phone || "");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [processando, setProcessando] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const handleFinalizarPedidoWeb = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    if (!nome || !whatsapp || !rua) {
      alert("Por favor, preencha o seu nome, WhatsApp e rua de entrega.");
      return;
    }

    setProcessando(true);

    const orderPayload = {
      clientName: nome,
      whatsapp,
      startDate: dataInicio,
      endDate: dataFim,
      rentalDays: diasLocacao,
      neighborhood: bairroSelecionado.nome,
      address: `${rua}, Nº ${numero || 'S/N'}`,
      reference: referencia,
      notes: observacoes,
      items: cartItems,
      subtotal: subtotalLocacao,
      freightFee: taxaFrete,
      totalPrice: valorTotalEstimado
    };

    try {
      // Salvar a transação no banco de dados no Railway
      const savedOrder = await saveOrderToDB(orderPayload, token);

      clearCart();
      setProcessando(false);

      // Redirecionar para o comprovante web
      navigate("/confirmacao-pedido", { state: { order: savedOrder } });
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Houve uma falha ao salvar o pedido. Tente novamente.");
      setProcessando(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl opacity-40">🛒</div>
        <h2 className="text-2xl font-bold text-white">Nenhum item selecionado no orçamento</h2>
        <p className="text-neutral-400 text-sm">
          Adicione mesas, cadeiras ou tendas ao seu carrinho antes de prosseguir.
        </p>
        <Link
          to="/catalogo"
          className="inline-block py-3 px-6 bg-helpusOrange hover:bg-[#d64a28] text-white font-semibold text-sm rounded-xl transition shadow-lg"
        >
          Ir para o Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <span className="text-xs uppercase font-bold text-helpusOrange">Passo Final</span>
        <h1 className="text-3xl font-extrabold text-white mt-1">Finalizar Reserva de Locação</h1>
        <p className="text-neutral-400 text-sm">
          Preencha os dados do seu evento. O pedido será registrado no banco de dados e gerará seu comprovante de reserva.
        </p>
      </div>

      <form onSubmit={handleFinalizarPedidoWeb} className="grid lg:grid-cols-3 gap-8">
        {/* Formulário de Dados */}
        <div className="lg:col-span-2 space-y-6 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-lg text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
            <span>📋</span> Dados do Cliente e do Evento
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                WhatsApp de Contato *
              </label>
              <input
                type="tel"
                required
                placeholder="(83) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 border-t border-neutral-800/80 pt-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Data de Entrega do Material *
              </label>
              <input
                type="date"
                required
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Data de Recolhimento / Devolução *
              </label>
              <input
                type="date"
                required
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-neutral-800/80 pt-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase">Endereço de Entrega:</h4>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Bairro / Cidade *
              </label>
              <select
                value={bairroSelecionado.nome}
                onChange={(e) => {
                  const b = BAIRROS_FRETE.find((item) => item.nome === e.target.value);
                  if (b) setBairroSelecionado(b);
                }}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
              >
                {BAIRROS_FRETE.map((b) => (
                  <option key={b.nome} value={b.nome}>
                    {b.nome} — Taxa estimada: {formatCurrency(b.taxa)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Rua / Av *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Av. Epitácio Pessoa"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1200"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Ponto de Referência
              </label>
              <input
                type="text"
                placeholder="Ex: Próximo ao quiosque X"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Observações / Horário de preferência
              </label>
              <textarea
                rows="2"
                placeholder="Ex: Entregar até às 14h do dia do evento."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
              />
            </div>
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div className="space-y-6 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl h-fit">
          <h3 className="font-bold text-lg text-white border-b border-neutral-800 pb-3 flex items-center justify-between">
            <span>🛒 Itens Solicitados</span>
            <span className="text-xs bg-helpusOrange/20 text-helpusOrange px-2.5 py-0.5 rounded font-bold">
              {diasLocacao} {diasLocacao === 1 ? 'diária' : 'diárias'}
            </span>
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.itemKey} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/60">
                <div>
                  <span className="font-bold text-white">{item.quantidade}x</span> {item.product.nome || item.product.name}
                  {item.opcoesSelecionadas.length > 0 && (
                    <span className="block text-[10px] text-neutral-400">
                      + {item.opcoesSelecionadas.map(o => o.nome || o.name).join(", ")}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-neutral-200">
                  {formatCurrency(item.precoUnitarioDiaria * item.quantidade)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-neutral-800 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal Itens ({diasLocacao}d):</span>
              <span className="text-white font-medium">{formatCurrency(subtotalLocacao)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Frete estimado ({bairroSelecionado.nome}):</span>
              <span className="text-white font-medium">{formatCurrency(taxaFrete)}</span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-neutral-800">
              <span>Total Estimado:</span>
              <span className="text-helpusOrange">{formatCurrency(valorTotalEstimado)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={processando}
            className="w-full py-3.5 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{processando ? "Registrando Reserva..." : "Concluir Reserva no Site"}</span>
            <span>⚡</span>
          </button>
        </div>
      </form>
    </div>
  );
}
