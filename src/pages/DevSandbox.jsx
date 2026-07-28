import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function DevSandbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sandboxActive, setSandboxActive] = useState(false);
  const [pedidosSimulados, setPedidosSimulados] = useState([]);

  useEffect(() => {
    const isDev = localStorage.getItem("plural_dev_mode") === "true";
    setSandboxActive(isDev);

    const devOrders = JSON.parse(localStorage.getItem("plural_dev_orders") || "[]");
    setPedidosSimulados(devOrders);
  }, []);

  const toggleDevMode = (status) => {
    localStorage.setItem("plural_dev_mode", status ? "true" : "false");
    setSandboxActive(status);
    alert(status ? "Modo de Desenvolvimento (Sandbox) ATIVADO!" : "Modo de Desenvolvimento DESATIVADO.");
  };

  const handleSimularOrcamento = () => {
    const fakeOrder = {
      id: `DEV-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: `ORD-TESTE-${Date.now().toString().slice(-4)}`,
      clientName: "Cliente Teste (Homologação)",
      whatsapp: "(83) 99999-0000",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      rentalDays: 2,
      neighborhood: "Tambaú",
      address: "Av. Epitácio Pessoa, 1000 (Endereço de Teste)",
      notes: "Pedido gerado via /dev para teste de contrato e PDF.",
      status: "PENDING",
      subtotal: 450.00,
      freightFee: 40.00,
      totalPrice: 940.00,
      isDevOrder: true,
      items: [
        {
          quantity: 20,
          unitPrice: 15.00,
          product: { nome: "Cadeira Tiffany Dourada (Teste)", imagem: "/mesas-e-cadeiras-01.jpeg" }
        },
        {
          quantity: 5,
          unitPrice: 30.00,
          product: { nome: "Mesa Redonda 8 Lugares (Teste)", imagem: "/mesas-e-cadeiras-01.jpeg" }
        }
      ],
      createdAt: new Date().toISOString()
    };

    const updated = [fakeOrder, ...pedidosSimulados];
    localStorage.setItem("plural_dev_orders", JSON.stringify(updated));
    setPedidosSimulados(updated);
    alert(`Orçamento de teste #${fakeOrder.orderNumber} criado com sucesso!`);
  };

  const handleLimparDadosTeste = () => {
    if (window.confirm("Deseja realmente apagar todos os orçamentos simulados do ambiente de testes?")) {
      localStorage.removeItem("plural_dev_orders");
      setPedidosSimulados([]);
      alert("Dados de testes limpos com sucesso!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
      {/* Header Banner Dev */}
      <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-black font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Ambiente de Testes / Staging
              </span>
              <span className="text-xs text-neutral-400 font-mono">https://plurallocacoes.helpusbr.com/dev</span>
            </div>
            <h1 className="text-3xl font-black text-white mt-1">🧪 Portal de Homologação & Desenvolvimento</h1>
            <p className="text-neutral-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Ambiente seguro isolado para você e o gerente testarem novas ideias, criarem orçamentos fictícios e testarem a emissão de PDFs **sem afetar a produção oficial do dono**.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
            <span className="text-xs font-bold text-neutral-300">Modo Sandbox:</span>
            <button
              onClick={() => toggleDevMode(!sandboxActive)}
              className={`py-1.5 px-4 rounded-xl text-xs font-black transition cursor-pointer ${
                sandboxActive
                  ? "bg-emerald-500 text-black shadow-lg"
                  : "bg-neutral-800 text-neutral-400 border border-neutral-700"
              }`}
            >
              {sandboxActive ? "🟢 ATIVADO" : "🔴 DESATIVADO"}
            </button>
          </div>
        </div>

        {/* Status de Alerta */}
        <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-2xl text-xs text-amber-200 flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <strong className="text-white block text-sm">Como funciona o `/dev` sem afetar a produção:</strong>
            <p className="mt-0.5 leading-relaxed text-neutral-300">
              Todos os orçamentos e testes gerados neste ambiente recebem a tag de homologação. Os relatórios de Faturamento Bruto e BI Oficiais do dono ignoram automaticamente os dados de teste.
            </p>
          </div>
        </div>
      </div>

      {/* Painel de Ações Rápidas de Teste */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold text-white text-base">Gerar Orçamento Simulado</h3>
            <p className="text-neutral-400 text-xs mt-1">
              Cria instantaneamente um orçamento fictício (Cadeiras Tiffany + Mesas) para testar a emissão de contratos A4 e propostas PDF.
            </p>
          </div>
          <button
            onClick={handleSimularOrcamento}
            className="w-full py-2.5 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow transition"
          >
            + Simular Orçamento Agora
          </button>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-2">⚙️</div>
            <h3 className="font-bold text-white text-base">Testar Painel ERP (Admin)</h3>
            <p className="text-neutral-400 text-xs mt-1">
              Acesse o painel administrativo para testar alterar status de entregas, cadastrar itens ou ver o DRE financeiro.
            </p>
          </div>
          <Link
            to="/admin"
            className="block text-center w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl transition"
          >
            Ir para o Painel Admin ⚙️
          </Link>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-2">🧹</div>
            <h3 className="font-bold text-white text-base">Limpar Dados de Homologação</h3>
            <p className="text-neutral-400 text-xs mt-1">
              Reseta o histórico de pedidos simulados do sandbox com 1 clique para iniciar novos testes do zero.
            </p>
          </div>
          <button
            onClick={handleLimparDadosTeste}
            className="w-full py-2.5 px-4 bg-red-950/80 border border-red-800/80 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl transition"
          >
            Limpar Testes Simulados
          </button>
        </div>
      </div>

      {/* Histórico de Orçamentos Simulados */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Histórico de Pedidos de Teste ({pedidosSimulados.length})</h2>
            <p className="text-neutral-400 text-xs">Orçamentos gerados exclusivamente no ambiente `/dev`.</p>
          </div>
        </div>

        {pedidosSimulados.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-xs">
            Nenhum pedido de teste simulado ainda. Clique no botão acima para criar o primeiro!
          </div>
        ) : (
          <div className="space-y-3">
            {pedidosSimulados.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono text-helpusOrange font-bold">{item.orderNumber}</span>
                  <div className="font-bold text-white mt-0.5">{item.clientName} ({item.neighborhood})</div>
                  <div className="text-neutral-400 text-[10px] mt-0.5">{item.notes}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-400 text-sm">
                    R$ {(item.totalPrice || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => navigate("/confirmacao-pedido", { state: { order: item } })}
                    className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg text-[11px]"
                  >
                    Ver Comprovante PDF 📄
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
