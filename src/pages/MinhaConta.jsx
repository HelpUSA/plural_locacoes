import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function MinhaConta() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  useEffect(() => {
    if (!user) return;

    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPedidos(data);
        } else {
          // Fallback para histórico do localStorage
          const savedOrders = JSON.parse(localStorage.getItem("plural_orders_history") || "[]");
          setPedidos(savedOrders);
        }
      } catch (e) {
        const savedOrders = JSON.parse(localStorage.getItem("plural_orders_history") || "[]");
        setPedidos(savedOrders);
      } finally {
        setLoadingPedidos(false);
      }
    };

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="bg-emerald-950/80 border border-emerald-700 text-emerald-400 px-2.5 py-1 rounded-md text-[11px] font-bold">✅ Orçamento Aprovado</span>;
      case "DELIVERED":
        return <span className="bg-blue-950/80 border border-blue-700 text-blue-400 px-2.5 py-1 rounded-md text-[11px] font-bold">🚚 Entregue no Local</span>;
      case "COMPLETED":
        return <span className="bg-purple-950/80 border border-purple-700 text-purple-400 px-2.5 py-1 rounded-md text-[11px] font-bold">🎉 Evento Concluído</span>;
      case "CANCELLED":
        return <span className="bg-red-950/80 border border-red-800 text-red-400 px-2.5 py-1 rounded-md text-[11px] font-bold">❌ Cancelado</span>;
      default:
        return <span className="bg-amber-950/80 border border-amber-700 text-amber-400 px-2.5 py-1 rounded-md text-[11px] font-bold">⏳ Em Análise</span>;
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
                {user.role === "ADMIN" ? "Administrador" : "Cliente"}
              </span>
            </div>
            <p className="text-neutral-400 text-xs mt-0.5">{user.email} • {user.phone || "Sem telefone"}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {user.role === "ADMIN" && (
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

      {/* Histórico de Orçamentos e Pedidos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Meus Orçamentos & Eventos</h2>
          <Link
            to="/catalogo"
            className="text-xs text-helpusOrange font-semibold hover:underline"
          >
            + Solicitar Novo Orçamento
          </Link>
        </div>

        {loadingPedidos ? (
          <div className="text-center py-12 text-neutral-400 text-sm">Carregando seus pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-3">
            <div className="text-4xl opacity-40">📜</div>
            <h3 className="font-bold text-white">Nenhum orçamento solicitado ainda</h3>
            <p className="text-neutral-400 text-xs">
              Quando você montar um orçamento no catálogo e enviar pelo WhatsApp, ele aparecerá aqui com o status de entrega.
            </p>
            <Link
              to="/catalogo"
              className="inline-block py-2.5 px-5 bg-helpusOrange text-white text-xs font-bold rounded-xl hover:bg-[#d64a28] transition"
            >
              Explorar Catálogo de Equipamentos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((order, idx) => (
              <div
                key={order.id || idx}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-2">
                  <div>
                    <div className="text-xs text-neutral-400 font-mono">Pedido #{order.id ? order.id.slice(0, 8) : idx + 1}</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {order.neighborhood} — {order.rentalDays} {order.rentalDays === 1 ? 'diária' : 'diárias'}
                    </div>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Período e Endereço */}
                <div className="grid sm:grid-cols-2 text-xs text-neutral-300 gap-2 bg-neutral-950 p-3 rounded-xl">
                  <div>
                    <span className="text-neutral-500 font-medium">Período:</span>{" "}
                    <span className="text-white font-semibold">{order.startDate} até {order.endDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-medium">Endereço:</span>{" "}
                    <span className="text-white font-semibold">{order.address} ({order.neighborhood})</span>
                  </div>
                </div>

                {/* Itens do Pedido */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    <div className="font-bold text-neutral-400">Itens Solicitados:</div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {order.items.map((it, i) => (
                        <div key={i} className="flex justify-between bg-neutral-950/60 p-2 rounded-lg border border-neutral-800/60">
                          <span>
                            <strong className="text-white">{it.quantity}x</strong> {it.product ? it.product.nome : "Equipamento"}
                          </span>
                          <span className="text-helpusOrange font-medium">{formatCurrency(it.unitPrice * it.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Valor Total */}
                <div className="flex justify-between items-center text-xs pt-2 border-t border-neutral-800">
                  <span className="text-neutral-400">Valor Total Estimado:</span>
                  <span className="text-lg font-bold text-helpusOrange">
                    {formatCurrency(order.totalPrice || order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
