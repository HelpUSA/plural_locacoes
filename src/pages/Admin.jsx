import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefault } = useProducts();
  const { user, token, isAdmin } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState("produtos"); // "produtos", "pedidos", "usuarios"
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingDados, setLoadingDados] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  // Form State Produto
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("mesas");
  const [precoDiaria, setPrecoDiaria] = useState("");
  const [precoSemanal, setPrecoSemanal] = useState("");
  const [imagem, setImagem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [highlight, setDestaque] = useState("");
  const [estoque, setEstoque] = useState("50");
  const [specsText, setSpecsText] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  const fetchPedidos = async () => {
    setLoadingDados(true);
    try {
      const res = await fetch(`${API_BASE}/admin/orders`, {
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
    } finally {
      setLoadingDados(false);
    }
  };

  const fetchUsuarios = async () => {
    setLoadingDados(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      } else {
        // Fallback local
        const currentUser = user ? [user] : [];
        setUsuarios(currentUser);
      }
    } catch (e) {
      setUsuarios(user ? [user] : []);
    } finally {
      setLoadingDados(false);
    }
  };

  useEffect(() => {
    if (abaAtiva === "pedidos") fetchPedidos();
    if (abaAtiva === "usuarios") fetchUsuarios();
  }, [abaAtiva]);

  const handleMudarStatus = async (orderId, novoStatus) => {
    try {
      await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: novoStatus })
      });
    } catch (e) {
      console.warn("Mudar status offline local:", e);
    }

    setPedidos((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: novoStatus } : o))
    );
  };

  const handleMudarRoleUsuario = async (userId, novoRole) => {
    try {
      await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ roleCode: novoRole })
      });
    } catch (e) {
      console.warn("Mudar role offline:", e);
    }

    setUsuarios((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, roleCode: novoRole } : u))
    );
  };

  const abrirModalCriar = () => {
    setProdutoEditando(null);
    setNome("");
    setCategoria("mesas");
    setPrecoDiaria("");
    setPrecoSemanal("");
    setImagem("/mesas-e-cadeiras-01.jpeg");
    setDescricao("");
    setDestaque("");
    setEstoque("50");
    setSpecsText("Capacidade: 8 lugares\nMaterial: MDF com pés de aço");
    setModalAberto(true);
  };

  const abrirModalEditar = (prod) => {
    setProdutoEditando(prod);
    setNome(prod.nome || prod.name);
    setCategoria(prod.categoria || prod.category || "mesas");
    setPrecoDiaria((prod.precoDiaria || prod.priceDaily || "").toString());
    setPrecoSemanal((prod.precoSemanal || prod.priceWeekly || "").toString());
    setImagem(prod.imagem || prod.image || "");
    setDescricao(prod.descricao || prod.description || "");
    setDestaque(prod.destaque || prod.highlight || "");
    setEstoque((prod.estoque || prod.stock || 50).toString());
    setSpecsText(
      typeof prod.specsJSON === "string"
        ? prod.specsJSON
        : JSON.stringify(prod.especificacoes || {}, null, 2)
    );
    setModalAberto(true);
  };

  const handleSalvarProduto = (e) => {
    e.preventDefault();

    const dados = {
      nome,
      categoria,
      precoDiaria: parseFloat(precoDiaria) || 0,
      precoSemanal: parseFloat(precoSemanal) || 0,
      imagem: imagem || "/mesas-e-cadeiras-01.jpeg",
      descricao,
      destaque,
      estoque: parseInt(estoque, 10) || 0,
      specsJSON: specsText
    };

    if (produtoEditando) {
      updateProduct(produtoEditando.id, dados);
    } else {
      addProduct(dados);
    }

    setModalAberto(false);
  };

  if (!isAdmin && user?.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl opacity-40">🔐</div>
        <h2 className="text-2xl font-bold text-white">Acesso Administrativo Restrito</h2>
        <p className="text-neutral-400 text-xs">
          Faça login com uma conta de administrador para acessar este painel.
        </p>
        <Link
          to="/login"
          className="inline-block py-2.5 px-6 bg-helpusOrange text-white font-bold text-xs rounded-xl hover:bg-[#d64a28] transition shadow"
        >
          Fazer Login como Admin
        </Link>
      </div>
    );
  }

  const totalProdutos = products.length;
  const totalEstoque = products.reduce((acc, p) => acc + (p.estoque || p.stock || 0), 0);
  const mediaPreco = totalProdutos
    ? products.reduce((acc, p) => acc + (p.precoDiaria || p.priceDaily || 0), 0) / totalProdutos
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header Admin */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase font-bold text-helpusOrange">Painel de Gestão Corporativo</span>
          <h1 className="text-3xl font-extrabold text-white">Administração Plural Locações</h1>
          <p className="text-neutral-400 text-sm">
            Gerencie equipamentos, monitore reservas web e gerencie permissões de usuários.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAbaAtiva("produtos")}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition ${
              abaAtiva === "produtos"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            📦 Catálogo ({totalProdutos})
          </button>

          <button
            onClick={() => setAbaAtiva("pedidos")}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition ${
              abaAtiva === "pedidos"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            📋 Reservas & Romaneio
          </button>

          <button
            onClick={() => setAbaAtiva("usuarios")}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition ${
              abaAtiva === "usuarios"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            👥 Usuários & Perfis
          </button>
        </div>
      </div>

      {abaAtiva === "produtos" && (
        <>
          {/* Cards Estatísticas Produtos */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <span className="text-xs text-neutral-400 font-medium">Equipamentos no Acervo</span>
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
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <span className="font-bold text-white text-sm">Acervo de Equipamentos</span>
              <button
                onClick={abrirModalCriar}
                className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white text-xs font-bold rounded-xl shadow transition"
              >
                + Novo Equipamento 📦
              </button>
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
                          src={prod.imagem || prod.image}
                          alt={prod.nome || prod.name}
                          className="w-10 h-10 object-cover rounded-lg border border-neutral-800"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{prod.nome || prod.name}</div>
                          <div className="text-neutral-500 text-[11px] truncate max-w-xs">{prod.destaque || prod.highlight || prod.descricao}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 capitalize font-medium">
                          {prod.categoria || prod.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white text-sm">
                        {formatCurrency(prod.precoDiaria || prod.priceDaily)}
                      </td>
                      <td className="p-4 font-medium text-neutral-300">
                        {prod.estoque || prod.stock || 50} un
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
                            if (confirm(`Deseja remover o produto "${prod.nome || prod.name}"?`)) {
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
        </>
      )}

      {abaAtiva === "pedidos" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Gestão de Transações e Entregas em Tempo Real</h2>

          {loadingDados ? (
            <div className="text-center py-12 text-neutral-400 text-sm">Carregando reservas...</div>
          ) : pedidos.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400 text-xs">
              Nenhuma reserva web registrada até o momento.
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((order) => (
                <div
                  key={order.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-2">
                    <div>
                      <div className="text-sm font-bold text-white">
                        👤 {order.clientName} ({order.whatsapp}) — <span className="text-helpusOrange">{order.orderNumber || order.id}</span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        📍 {order.address} ({order.neighborhood}) • 📅 {order.startDate} até {order.endDate} ({order.rentalDays}d)
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400">Status da Locação:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleMudarStatus(order.id, e.target.value)}
                        className="bg-neutral-950 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-helpusOrange font-semibold"
                      >
                        <option value="PENDING">⏳ Registrado / Em Análise</option>
                        <option value="APPROVED">✅ Aprovado</option>
                        <option value="PREPARING">📦 Em Separação no Galpão</option>
                        <option value="OUT_FOR_DELIVERY">🚚 Saiu para Entrega</option>
                        <option value="DELIVERED">🎪 Entregue no Local</option>
                        <option value="COMPLETED">🏁 Recolhido & Concluído</option>
                        <option value="CANCELLED">❌ Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400">Valor Total do Pedido:</span>
                    <span className="text-lg font-bold text-helpusOrange">
                      {formatCurrency(order.totalPrice || order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {abaAtiva === "usuarios" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Gestão de Usuários & Níveis de Acesso (RBAC)</h2>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Usuário</th>
                    <th className="p-4">E-mail</th>
                    <th className="p-4">Telefone</th>
                    <th className="p-4">Perfil de Acesso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-950/50 transition">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 text-neutral-300">{u.email}</td>
                      <td className="p-4 text-neutral-400">{u.phone || "—"}</td>
                      <td className="p-4">
                        <select
                          value={u.roleCode || (u.role === "ADMIN" ? "ADMIN" : "CLIENT")}
                          onChange={(e) => handleMudarRoleUsuario(u.id, e.target.value)}
                          className="bg-neutral-950 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-helpusOrange font-bold"
                        >
                          <option value="CLIENT">👤 Cliente</option>
                          <option value="ADMIN">👑 Administrador</option>
                          <option value="LOGISTICS">🚚 Equipe Logística / Entregas</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulário Criar/Editar Produto */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-lg">
                {produtoEditando ? "Editar Equipamento" : "Novo Equipamento para Locação"}
              </h3>
              <button onClick={() => setModalAberto(false)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarProduto} className="space-y-4 text-xs">
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
                    <option value="iluminacao-climatizacao">Iluminação & Climatização</option>
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
                  <label className="block text-neutral-400 mb-1">Caminho da Imagem</label>
                  <input
                    type="text"
                    value={imagem}
                    onChange={(e) => setImagem(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Estoque Disponível</label>
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
                  placeholder="Ex: Campeão de vendas para casamentos"
                  value={highlight}
                  onChange={(e) => setDestaque(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Especificações Técnicas (Key: Value)</label>
                <textarea
                  rows="2"
                  placeholder="Material: Aço carbono&#10;Dimensões: 1,20m"
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-helpusOrange"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="py-2 px-4 bg-neutral-800 text-neutral-300 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-helpusOrange text-white rounded-xl font-bold shadow"
                >
                  Salvar Equipamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
