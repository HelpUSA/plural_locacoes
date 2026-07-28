import React from "react";

export default function ContratoPDF({ order, companySettings, onClose }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-neutral-900 max-w-4xl w-full rounded-2xl shadow-2xl p-8 sm:p-12 space-y-8 my-8 print:p-0 print:shadow-none print:w-full print:max-w-none font-sans">
        
        {/* Barra Superior de Ações (Oculta na Impressão) */}
        <div className="flex justify-between items-center border-b border-neutral-200 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-neutral-600 font-bold text-xs">
            <span>📄 Contrato de Locação & Romaneio Oficial</span>
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

        {/* Cabeçalho Oficial do Contrato */}
        <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase text-neutral-900">{settings.companyName}</h1>
            <p className="text-xs text-neutral-600">Locação de Equipamentos, Móveis e Tendas para Eventos</p>
            <p className="text-xs text-neutral-500">{settings.warehouseAddress}</p>
            <p className="text-xs text-neutral-500">Contato: {settings.whatsappSupport}</p>
          </div>
          <div className="text-right space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-helpusOrange block">
              Contrato de Locação
            </span>
            <div className="text-xl font-bold font-mono text-neutral-900">
              #{order.orderNumber || order.id}
            </div>
            <div className="text-xs text-neutral-500">
              Emissão: {new Date(order.createdAt || Date.now()).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>

        {/* Dados das Partes */}
        <div className="grid grid-cols-2 gap-6 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <div className="space-y-1">
            <span className="font-bold uppercase text-neutral-500 block text-[10px]">LOCATÁRIO (CLIENTE):</span>
            <div className="font-bold text-sm text-neutral-900">{order.clientName}</div>
            <div className="text-neutral-700">WhatsApp: {order.whatsapp}</div>
            <div className="text-neutral-700">Endereço: {order.address}</div>
            <div className="text-neutral-700">Bairro: {order.neighborhood} — João Pessoa/PB</div>
            {order.reference && <div className="text-neutral-500">Ref: {order.reference}</div>}
          </div>

          <div className="space-y-1 border-l border-neutral-200 pl-6">
            <span className="font-bold uppercase text-neutral-500 block text-[10px]">DADOS DA ENTREGA & EVENTO:</span>
            <div><span className="font-semibold">Data de Entrega:</span> {order.startDate}</div>
            <div><span className="font-semibold">Data de Devolução:</span> {order.endDate}</div>
            <div><span className="font-semibold">Duração:</span> {order.rentalDays} {order.rentalDays === 1 ? 'diária' : 'diárias'}</div>
            {order.notes && <div className="text-neutral-600 pt-1">Obs: {order.notes}</div>}
          </div>
        </div>

        {/* Tabela de Equipamentos */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-700">Relação de Equipamentos & Romaneio de Carga:</h3>
          <table className="w-full text-left text-xs border border-neutral-300 rounded-lg overflow-hidden">
            <thead className="bg-neutral-100 text-neutral-700 font-bold uppercase border-b border-neutral-300">
              <tr>
                <th className="p-3">Qtd</th>
                <th className="p-3">Equipamento / Especificação</th>
                <th className="p-3 text-right">Unitário / Diária</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {order.items && order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-bold text-neutral-900">{item.quantity || item.quantidade}x</td>
                  <td className="p-3">
                    <span className="font-semibold text-neutral-900">{item.product ? item.product.nome : "Equipamento"}</span>
                    {item.addOns && (
                      <span className="block text-[11px] text-neutral-500 mt-0.5">
                        Opcionais: {typeof item.addOns === 'string' ? item.addOns : JSON.stringify(item.addOns)}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right font-medium text-neutral-700">
                    {formatCurrency(item.unitPrice || item.precoUnitarioDiaria)}
                  </td>
                  <td className="p-3 text-right font-bold text-neutral-900">
                    {formatCurrency((item.unitPrice || item.precoUnitarioDiaria) * (item.quantity || item.quantidade))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumo Financeiro */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-1.5 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal Equipamentos:</span>
              <span className="font-semibold text-neutral-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Taxa de Frete / Logística:</span>
              <span className="font-semibold text-neutral-900">{formatCurrency(order.freightFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-300">
              <span>VALOR TOTAL:</span>
              <span className="text-helpusOrange">{formatCurrency(order.totalPrice || order.total)}</span>
            </div>
          </div>
        </div>

        {/* Cláusulas Contratuais */}
        <div className="space-y-2 text-[11px] text-neutral-600 bg-neutral-50 p-4 rounded-xl border border-neutral-200 leading-relaxed">
          <h4 className="font-bold text-neutral-900 uppercase">Cláusulas e Termo de Responsabilidade:</h4>
          <p>
            1. O LOCATÁRIO declara ter recebido os bens descritos neste romaneio em perfeito estado de conservação e funcionamento, comprometendo-se a devolvê-los nas mesmas condições.
          </p>
          <p>
            2. Eventuais danos, quebras ou extravios de peças durante o período de locação serão cobrados separadamente com base no valor de reposição do acervo.
          </p>
          <p>
            3. A devolução dos equipamentos deverá ocorrer rigorosamente no dia e horário contratados.
          </p>
        </div>

        {/* Assinaturas */}
        <div className="grid grid-cols-2 gap-12 pt-12 text-center text-xs">
          <div className="border-t border-neutral-400 pt-2">
            <span className="font-bold text-neutral-900 block">{settings.companyName}</span>
            <span className="text-neutral-500 text-[10px]">LOCADOR</span>
          </div>

          <div className="border-t border-neutral-400 pt-2">
            <span className="font-bold text-neutral-900 block">{order.clientName}</span>
            <span className="text-neutral-500 text-[10px]">LOCATÁRIO</span>
          </div>
        </div>

      </div>
    </div>
  );
}
