import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function ConfirmacaoPedido() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl opacity-40">📄</div>
        <h2 className="text-2xl font-bold text-white">Nenhum comprovante encontrado</h2>
        <p className="text-neutral-400 text-xs">
          Acesse a sua conta para visualizar seu histórico de solicitações.
        </p>
        <Link
          to="/minha-conta"
          className="inline-block py-2.5 px-6 bg-helpusOrange text-white font-bold text-xs rounded-xl hover:bg-[#d64a28] transition shadow"
        >
          Ir para Minha Conta
        </Link>
      </div>
    );
  }

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header Sucesso */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center space-y-3 shadow-2xl animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-3xl flex items-center justify-center mx-auto border border-emerald-500/30">
          ✓
        </div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
          Solicitação de Locação Registrada com Sucesso
        </span>
        <h1 className="text-3xl font-black text-white">
          Comprovante de Reserva #{order.orderNumber || order.id}
        </h1>
        <p className="text-neutral-400 text-xs max-w-lg mx-auto">
          Seu pedido foi registrado no sistema e a nossa equipe de logística já iniciou a verificação de disponibilidade do acervo para o período solicitado.
        </p>
      </div>

      {/* Cartão de Detalhes da Reserva (Estilo Comprovante) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
        <div className="flex flex-wrap justify-between items-center border-b border-neutral-800 pb-4 gap-2">
          <div>
            <div className="text-xs text-neutral-500 font-mono">Código do Pedido</div>
            <div className="text-lg font-bold text-helpusOrange">{order.orderNumber || order.id}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500 font-mono">Data da Solicitação</div>
            <div className="text-xs text-white font-semibold">{new Date(order.createdAt || Date.now()).toLocaleDateString("pt-BR")}</div>
          </div>
        </div>

        {/* Linha do Tempo de Status */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Status do Pedido:</div>
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              ⏳ Solicitação em Análise / Registrado
            </span>
            <span className="text-[11px] text-neutral-500">100% Concluído no Site</span>
          </div>
        </div>

        {/* Dados do Cliente & Evento */}
        <div className="grid sm:grid-cols-2 gap-4 text-xs bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
          <div>
            <span className="text-neutral-500 block font-medium">Cliente:</span>
            <strong className="text-white text-sm">{order.clientName}</strong>
            <span className="block text-neutral-400 mt-0.5">{order.whatsapp}</span>
          </div>
          <div>
            <span className="text-neutral-500 block font-medium">Período da Locação:</span>
            <strong className="text-white text-sm">{order.startDate} até {order.endDate}</strong>
            <span className="block text-neutral-400 mt-0.5">({order.rentalDays} {order.rentalDays === 1 ? 'diária' : 'diárias'})</span>
          </div>
          <div className="sm:col-span-2 pt-2 border-t border-neutral-800/60">
            <span className="text-neutral-500 block font-medium">Endereço de Entrega:</span>
            <strong className="text-white">{order.address} — Bairro {order.neighborhood}</strong>
            {order.reference && <span className="block text-neutral-400">Ponto de Ref: {order.reference}</span>}
          </div>
        </div>

        {/* Lista de Equipamentos Solicitados */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Equipamentos Solicitados:</div>
          <div className="divide-y divide-neutral-800/60 border border-neutral-800/80 rounded-xl overflow-hidden bg-neutral-950/60">
            {order.items && order.items.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white text-sm">{item.quantity || item.quantidade}x</span>{" "}
                  <span className="text-neutral-200">{item.product ? item.product.nome : "Equipamento"}</span>
                </div>
                <span className="font-semibold text-helpusOrange">
                  {formatCurrency((item.unitPrice || item.precoUnitarioDiaria) * (item.quantity || item.quantidade))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="space-y-2 pt-3 border-t border-neutral-800 text-xs">
          <div className="flex justify-between text-neutral-400">
            <span>Subtotal Equipamentos ({order.rentalDays}d):</span>
            <span className="text-white font-medium">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Taxa de Entrega Estimada:</span>
            <span className="text-white font-medium">{formatCurrency(order.freightFee)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-neutral-800">
            <span>Valor Total Estimado:</span>
            <span className="text-helpusOrange">{formatCurrency(order.totalPrice || order.total)}</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-800">
          <button
            onClick={handleImprimir}
            className="flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>🖨️ Imprimir / Salvar Comprovante</span>
          </button>

          <Link
            to="/minha-conta"
            className="flex-1 py-3 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl transition text-center shadow"
          >
            Acompanhar em Minha Conta
          </Link>
        </div>

        <div className="text-center pt-2">
          <a
            href={`https://wa.me/5583999087188?text=Ola%2C%20gostaria%20de%20duvidas%20sobre%20o%20meu%20pedido%20${order.orderNumber || order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 hover:text-white underline"
          >
            Tirar dúvidas com o suporte via WhatsApp 💬
          </a>
        </div>
      </div>
    </div>
  );
}
