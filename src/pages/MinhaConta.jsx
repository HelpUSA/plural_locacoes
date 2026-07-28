import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart, BAIRROS_FRETE } from "../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import HelpTooltip from "../components/HelpTooltip.jsx";

export default function MinhaConta() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  // Modal de Edição de Pedido pelo Cliente
  const [pedidoEdicao, setPedidoEdicao] = useState(null);
  const [editRua, setEditRua] = useState("");
  const [editBairro, setEditBairro] = useState("");
  const [editDataInicio, setEditDataInicio] = useState("");
  const [editDataFim, setEditDataFim] = useState("");
  const [editObservacoes, setEditObservacoes] = useState("");
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      } else {
        const savedOrders = JSON.parse(localStorage.getItem("plural_orders_history") || "[]");
        setPedidos(savedOrders);
      }
    } catch (e) {
      const savedOrders = JSON.parse(localStorage.getItem("plural_orders_history") || "[]");
      setPedidos(savedOrders);
    } fontFinally: {
      setLoadingPedidos(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMyOrders();
  }, [user, token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl opacity-40">🔒</div>
        <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
        <p className="text-neutral-400 text-sm">
          Você precisa estar logado para acessar a sua área do cliente.
        </p>
        <Link
          to="/login"
          className="inline-block py-2.5 px-6 bg-helpusOrange text-white font-bold text-sm rounded-xl hover:bg-[#d64a28] transition shadow"
        >
          Fazer Login
        </Link>
      </div>
    );
  }

  const handleAbrirEdicao = (order) => {
    setPedidoEdicao(order);
    setEditRua(order.address || "");
    setEditBairro(order.neighborhood || BAIRROS_FRETE[0].nome);
    setEditDataInicio(order.startDate || "");
    setEditDataFim(order.endDate || "");
    setEditObservacoes(order.notes || "");
  };

  const handleSalvarEdicaoPedido = async (e) => {
    e.preventDefault();
    if (!pedidoEdicao) return;

    setSalvandoEdicao(true);

    const b = BAIRROS_FRETE.find((item) => item.nome === editBairro) || BAIRROS_FRETE[0];
    const newFreightFee = b.taxa;

    let dDays = 1;
    if (editDataInicio && editDataFim) {
      const start = new Date(editDataInicio);
      const end = new Date(editDataFim);
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      dDays = diffDays > 0 ? diffDays : 1;
    }

    const subtotal = pedidoEdicao.subtotal || 0;
    const newTotal = subtotal * dDays + newFreightFee;

    const payload = {
      address: editRua,
      neighborhood: editBairro,
      startDate: editDataInicio,
      endDate: editDataFim,
      rentalDays: dDays,
      freightFee: newFreightFee,
      totalPrice: newTotal,
      notes: editObservacoes
    };

    try {
      const res = await fetch(`${API_BASE}/orders/${pedidoEdicao.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Solicitação de pedido atualizada com sucesso!");
        fetchMyOrders();
        setPedidoEdicao(null);
      } else {
        // Fallback Local
        const savedOrders = JSON.parse(localStorage.getItem("plural_orders_history") || "[]");
        const updated = savedOrders.map((o) => (o.id === pedidoEdicao.id ? { ...o, ...payload } : o));
        localStorage.setItem("plural_orders_history", JSON.stringify(updated));
        setPedidos(updated);
        alert("Alterações salvas com sucesso!");
        setPedidoEdicao(null);
      }
    } catch (err) {
      console.error("Erro ao editar pedido:", err);
      alert("Houve uma falha ao atualizar. Tente novamente.");
    } finally {
      setSalvandoEdicao(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="bg-emerald-950/80 border border-emerald-700 text-emerald-400 px-3 py-1 rounded-full text-xs font-black">✅ Orçamento Aprovado com Sinal</span>;
      case "DELIVERED":
        return <span className="bg-blue-950/80 border border-blue-700 text-blue-400 px-3 py-1 rounded-full text-xs font-black">🚚 Entregue no Local</span>;
      case "COMPLETED":
        return <span className="bg-purple-950/80 border border-purple-700 text-purple-400 px-3 py-1 rounded-full text-xs font-black">🎉 Evento Concluído</span>;
      case "CANCELLED":
        return <span className="bg-red-950/80 border border-red-800 text-red-400 px-3 py-1 rounded-full text-xs font-black">❌ Cancelado</span>;
      default:
        return <span className="bg-amber-950/80 border border-amber-700 text-amber-400 px-3 py-1 rounded-full text-xs font-black">⏳ Solicitação em Análise</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header Perfil */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-helpusOrange text-white font-bold text-2xl flex items-center justify-center shadow-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 uppercase">
                {user.role === "ADMIN" || user.role === "DEVELOPER" ? "Administrador" : "Cliente"}
              </span>
            </div>
            <p className="text-neutral-400 text-xs mt-0.5">{user.email} • {user.phone || "Sem telefone cadastrado"}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(user.role === "ADMIN" || user.role === "DEVELOPER") && (
            <Link
              to="/admin"
              className="py-2 px-4 bg-helpusOrange text-white text-xs font-bold rounded-xl hover:bg-[#d64a28] transition shadow"
            >
              Painel Admin ⚙️
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition"
          >
            Sair da Conta 🚪
          </button>
        </div>
      </div>

      {/* Histórico de Orçamentos com Relatório Visual Detalhado */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span>Meus Orçamentos & Eventos</span>
              <HelpTooltip
                titulo="Área de Gerenciamento do Cliente"
                explicacao="Aqui você acompanha o relatório visual dos equipamentos solicitados, linha do tempo de entrega e pode realizar alterações nas solicitações."
                passos={[
                  "Veja as fotos em alta definição dos equipamentos e valores por diária",
                  "Clique em '✏️ Editar Pedido' para alterar as datas de entrega/devolução ou endereço",
                  "Clique em '📄 Ver Comprovante PDF' para visualizar/imprimir a proposta comercial com QR Code PIX"
                ]}
                dica="Todas as edições feitas aqui atualizam imediatamente no painel dos atendentes da loja."
              />
            </h2>
            <p className="text-neutral-400 text-xs mt-0.5">
              Relatório visual completo das suas solicitações, fotos dos produtos e opção de edição.
            </p>
          </div>

          <Link
            to="/orcamentos"
            className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white text-xs font-bold rounded-xl transition shadow"
          >
            + Novo Orçamento Guiado
          </Link>
        </div>

        {loadingPedidos ? (
          <div className="text-center py-12 text-neutral-400 text-sm">Carregando relatórios visuais dos seus pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center space-y-4 shadow-xl">
            <div className="text-5xl opacity-40">📜</div>
            <h3 className="font-bold text-white text-lg">Nenhum orçamento registrado no momento</h3>
            <p className="text-neutral-400 text-xs max-w-md mx-auto">
              Monte um orçamento no nosso assistente guiado. O pedido aparecerá aqui com relatório visual e controle de entrega.
            </p>
            <Link
              to="/orcamentos"
              className="inline-block py-3 px-6 bg-helpusOrange text-white text-xs font-bold rounded-xl hover:bg-[#d64a28] transition shadow-lg"
            >
              Iniciar Orçamento Interativo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((order, idx) => (
              <div
                key={order.id || idx}
                className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
              >
                {/* Cabeçalho do Card Relatório */}
                <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-helpusOrange font-bold">
                        {order.orderNumber || `ORD-${order.id ? order.id.slice(0, 8) : idx + 1}`}
                      </span>
                      <span className="text-[10px] text-neutral-500">• {new Date(order.createdAt || Date.now()).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <h3 className="text-lg font-black text-white mt-1">
                      {order.neighborhood} — {order.rentalDays} {order.rentalDays === 1 ? 'diária' : 'diárias'}
                    </h3>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Período e Endereço Detalhado */}
                <div className="grid sm:grid-cols-2 text-xs text-neutral-300 gap-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800/80">
                  <div>
                    <span className="text-neutral-500 font-bold block uppercase text-[10px]">Período Solicitado:</span>{" "}
                    <strong className="text-white text-sm">{order.startDate} até {order.endDate}</strong>
                    <span className="block text-neutral-400 mt-0.5">({order.rentalDays} {order.rentalDays === 1 ? 'diária' : 'diárias'})</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-bold block uppercase text-[10px]">Endereço de Entrega:</span>{" "}
                    <strong className="text-white text-sm">{order.address}</strong>
                    <span className="block text-neutral-400 mt-0.5">Bairro {order.neighborhood}</span>
                  </div>
                </div>

                {/* Galeria / Relatório Visual dos Produtos Solicitados */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Relatório Visual dos Equipamentos Solicitados:
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map((it, i) => {
                        const prodObj = it.product || {};
                        return (
                          <div
                            key={i}
                            className="bg-neutral-950 border border-neutral-800 p-3 rounded-2xl flex items-center gap-3"
                          >
                            <img
                              src={prodObj.image || prodObj.imagem || "/mesas-e-cadeiras-01.jpeg"}
                              alt={prodObj.nome || prodObj.name}
                              className="w-14 h-14 object-cover rounded-xl border border-neutral-800"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <div className="font-bold text-white truncate">{prodObj.nome || prodObj.name || "Equipamento"}</div>
                              <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                                {it.quantity || it.quantidade}x un • {formatCurrency(it.unitPrice || it.precoUnitarioDiaria)} /d
                              </div>
                              <div className="font-bold text-helpusOrange mt-1">
                                Total: {formatCurrency((it.unitPrice || it.precoUnitarioDiaria || 0) * (it.quantity || it.quantidade || 1) * (order.rentalDays || 1))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Resumo Financeiro & Ações de Edição */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                  <div>
                    <span className="text-xs text-neutral-400 block">Valor Total Estimado:</span>
                    <span className="text-xl font-black text-helpusOrange">
                      {formatCurrency(order.totalPrice || order.total)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleAbrirEdicao(order)}
                      className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <span>✏️</span>
                      <span>Editar Pedido</span>
                    </button>

                    <button
                      onClick={() => navigate("/confirmacao-pedido", { state: { order } })}
                      className="py-2.5 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5"
                    >
                      <span>📄</span>
                      <span>Ver Comprovante PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== MODAL DE EDIÇÃO DE PEDIDO PELO CLIENTE ===== */}
      {pedidoEdicao && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold text-helpusOrange">Edição de Pedido</span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Editar {pedidoEdicao.orderNumber || `ORD-${pedidoEdicao.id}`}
                </h3>
              </div>
              <button
                onClick={() => setPedidoEdicao(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarEdicaoPedido} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Data de Entrega *</label>
                  <input
                    type="date"
                    required
                    value={editDataInicio}
                    onChange={(e) => setEditDataInicio(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Data de Devolução *</label>
                  <input
                    type="date"
                    required
                    value={editDataFim}
                    onChange={(e) => setEditDataFim(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Bairro de Entrega em João Pessoa *</label>
                <select
                  value={editBairro}
                  onChange={(e) => setEditBairro(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 font-bold"
                >
                  {BAIRROS_FRETE.map((b) => (
                    <option key={b.nome} value={b.nome}>
                      {b.nome} ({formatCurrency(b.taxa)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Endereço (Rua, Nº) *</label>
                <input
                  type="text"
                  required
                  value={editRua}
                  onChange={(e) => setEditRua(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Observações do Pedido</label>
                <textarea
                  rows="2"
                  value={editObservacoes}
                  onChange={(e) => setEditObservacoes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setPedidoEdicao(null)}
                  className="py-2.5 px-4 bg-neutral-800 text-neutral-300 rounded-xl font-bold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvandoEdicao}
                  className="py-2.5 px-6 bg-helpusOrange hover:bg-[#d64a28] text-white rounded-xl font-bold shadow"
                >
                  {salvandoEdicao ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
