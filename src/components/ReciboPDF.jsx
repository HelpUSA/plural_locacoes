import React from "react";

export default function ReciboPDF({ order, companySettings, onClose }) {
  if (!order) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const settings = companySettings || {
    companyName: "Plural Locações & Eventos",
    whatsappSupport: "(83) 99908-7188",
    warehouseAddress: "Av. Epitácio Pessoa, 1250 - João Pessoa / PB",
    pixKey: "83999087188"
  };

  const valorTotal = order.totalPrice || order.total || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-neutral-900 max-w-3xl w-full rounded-2xl shadow-2xl p-8 sm:p-12 space-y-8 my-8 print:p-0 print:shadow-none print:w-full print:max-w-none font-sans">
        
        {/* Barra Superior (Oculta na Impressão) */}
        <div className="flex justify-between items-center border-b border-neutral-200 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-neutral-600 font-bold text-xs">
            <span>🧾 Recibo de Quitação Financeira Oficial</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
            >
              <span>🖨️ Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs rounded-xl transition"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Cabeçalho Recibo */}
        <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase text-neutral-900">{settings.companyName}</h1>
            <p className="text-xs text-neutral-600">{settings.warehouseAddress}</p>
            <p className="text-xs text-neutral-500">Contato: {settings.whatsappSupport}</p>
          </div>
          <div className="text-right space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 block">
              Recibo de Quitação
            </span>
            <div className="text-2xl font-black text-emerald-600">
              {formatCurrency(valorTotal)}
            </div>
            <div className="text-xs text-neutral-500">
              Data: {new Date().toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>

        {/* Declaração Formal de Quitação */}
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-3 text-xs leading-relaxed text-neutral-800">
          <p className="text-sm">
            Recebemos de <strong className="text-neutral-900 uppercase">{order.clientName}</strong> (WhatsApp: {order.whatsapp}) a quantia de <strong className="text-emerald-800 text-base">{formatCurrency(valorTotal)}</strong>.
          </p>
          <p>
            Referente ao pagamento de locação de equipamentos referente à reserva <strong className="font-mono text-neutral-900">#{order.orderNumber || order.id}</strong> para o evento realizado no período de <strong>{order.startDate}</strong> a <strong>{order.endDate}</strong> no endereço <strong>{order.address} ({order.neighborhood})</strong>.
          </p>
          <p className="text-neutral-600 font-semibold text-[11px] pt-2 border-t border-emerald-200">
            Damos por este instrumento a plena e geral quitação do referido valor.
          </p>
        </div>

        {/* Assinatura do Emissor */}
        <div className="pt-12 text-center text-xs">
          <div className="w-64 mx-auto border-t border-neutral-400 pt-2">
            <span className="font-bold text-neutral-900 block">{settings.companyName}</span>
            <span className="text-neutral-500 text-[10px]">EMISSOR DO RECIBO</span>
          </div>
        </div>

      </div>
    </div>
  );
}
