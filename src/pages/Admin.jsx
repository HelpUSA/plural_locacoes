import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import ContratoPDF from "../components/ContratoPDF.jsx";

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user, token, isAdmin, isDeveloper } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState("produtos"); // "produtos", "romaneio", "financeiro", "manutencao", "usuarios", "configs"
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [financeiroSummary, setFinanceiroSummary] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [companySettings, setCompanySettings] = useState({
    pixKey: "83999087188",
    companyName: "Plural Locações & Eventos",
    whatsappSupport: "(83) 99908-7188",
    warehouseAddress: "Av. Epitácio Pessoa, 1250 - Tambaú, João Pessoa - PB",
    depositPercent: "30%",
    rentalTerms: "A devolução deve ocorrer até às 12h do dia acordado."
  });

  const [loadingDados, setLoadingDados] = useState(false);
  const [contratoModalOrder, setContratoModalOrder] = useState(null);

  // Modais de Form
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
  const [modalDespesaAberto, setModalDespesaAberto] = useState(false);
  const [modalManutencaoAberto, setModalManutencaoAberto] = useState(false);
  const [modalVistoriaOrder, setModalVistoriaOrder] = useState(null);

  // States Form Produto
  const [sku, setSku] = useState("");
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("mesas");
  const [precoDiaria, setPrecoDiaria] = useState("");
  const [imagem, setImagem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cor, setCor] = useState("");
  const [material, setMaterial] = useState("");
  const [dimensoes, setDimensoes] = useState("");
  const [pesoSuportado, setPesoSuportado] = useState("");
  const [estoque, setEstoque] = useState("50");
  const [produtoEditando, setProdutoEditando] = useState(null);

  // States Form Despesa/Entrada
  const [despesaDesc, setDespesaDesc] = useState("");
  const [despesaValor, setDespesaValor] = useState("");
  const [despesaTipo, setDespesaTipo] = useState("EXPENSE"); // EXPENSE ou INCOME
  const [despesaCat, setDespesaCat] = useState("MANUTENCAO");

  // States Form Manutenção
  const [manutProdId, setManutProdId] = useState("");
  const [manutQtd, setManutQtd] = useState("1");
  const [manutDesc, setManutDesc] = useState("");
  const [manutCusto, setManutCusto] = useState("0");

  // States Form Vistoria Retorno
  const [damagedNotes, setDamagedNotes] = useState("");
  const [damagedFee, setDamagedFee] = useState("0");

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
      }
    } catch (e) {
      console.warn("Erro ao buscar pedidos:", e);
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
      }
    } catch (e) {
      console.warn("Erro ao buscar usuários:", e);
    } finally {
      setLoadingDados(false);
    }
  };

  const fetchFinanceiro = async () => {
    setLoadingDados(true);
    try {
      const resSummary = await fetch(`${API_BASE}/admin/financial/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resSummary.ok) {
        const data = await resSummary.json();
        setFinanceiroSummary(data);
        setTransacoes(data.recentTransactions || []);
      }
    } catch (e) {
      console.warn("Erro ao buscar financeiro:", e);
    } finally {
      setLoadingDados(false);
    }
  };

  const fetchManutencao = async () => {
    setLoadingDados(true);
    try {
      const res = await fetch(`${API_BASE}/admin/maintenance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setManutencoes(data.logs || []);
        setFornecedores(data.suppliers || []);
      }
    } catch (e) {
      console.warn("Erro ao buscar manutenção:", e);
    } finally {
      setLoadingDados(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/settings`);
      if (res.ok) {
        const data = await res.json();
        setCompanySettings(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.warn("Erro ao carregar configurações:", e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (abaAtiva === "romaneio") fetchPedidos();
    if (abaAtiva === "usuarios") fetchUsuarios();
    if (abaAtiva === "financeiro") fetchFinanceiro();
    if (abaAtiva === "manutencao") fetchManutencao();
  }, [abaAtiva]);

  const handleMudarStatusPedido = async (orderId, novoStatus) => {
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
      console.warn("Mudar status offline:", e);
    }

    setPedidos((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: novoStatus } : o))
    );
  };

  const handleSalvarVistoria = async (e) => {
    e.preventDefault();
    if (!modalVistoriaOrder) return;

    try {
      await fetch(`${API_BASE}/admin/orders/${modalVistoriaOrder.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: "RETURNED",
          comment: `Vistoria de Retorno realizada. Avarias: ${damagedNotes}. Taxa: R$ ${damagedFee}`
        })
      });

      // Se houver taxa de avarias cobrada, registrar no financeiro
      if (parseFloat(damagedFee) > 0) {
        await fetch(`${API_BASE}/admin/financial/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            description: `Taxa de Avaria/Quebra - Pedido #${modalVistoriaOrder.orderNumber || modalVistoriaOrder.id}`,
            amount: parseFloat(damagedFee),
            type: "INCOME",
            category: "AVARIAS"
          })
        });
      }

      setPedidos((prev) =>
        prev.map((o) => (o.id === modalVistoriaOrder.id ? { ...o, status: "RETURNED", damagedNotes, damagedFee: parseFloat(damagedFee) } : o))
      );

      setModalVistoriaOrder(null);
      alert("Vistoria de Retorno e Romaneio salvos com sucesso!");
    } catch (e) {
      alert("Erro ao salvar vistoria.");
    }
  };

  const handleSalvarDespesa = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/financial/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          description: despesaDesc,
          amount: parseFloat(despesaValor),
          type: despesaTipo,
          category: despesaCat
        })
      });

      if (res.ok) {
        const newTrans = await res.json();
        setTransacoes(prev => [newTrans, ...prev]);
        fetchFinanceiro();
        setModalDespesaAberto(false);
        setDespesaDesc("");
        setDespesaValor("");
      }
    } catch (e) {
      alert("Erro ao registrar lançamento.");
    }
  };

  const handleSalvarManutencao = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/maintenance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: manutProdId || (products[0] ? products[0].id : ""),
          quantity: parseInt(manutQtd, 10),
          issueDescription: manutDesc,
          cost: parseFloat(manutCusto)
        })
      });

      if (res.ok) {
        fetchManutencao();
        setModalManutencaoAberto(false);
        setManutDesc("");
        setManutCusto("0");
      }
    } catch (e) {
      alert("Erro ao registrar manutenção.");
    }
  };

  const handleSalvarSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(companySettings)
      });

      if (res.ok) {
        alert("Configurações da empresa salvas com sucesso!");
      }
    } catch (e) {
      alert("Erro ao salvar configurações.");
    }
  };

  if (!isAdmin && user?.role !== "ADMIN" && user?.role !== "DEVELOPER") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl opacity-40">🔐</div>
        <h2 className="text-2xl font-bold text-white">Acesso Administrativo Restrito</h2>
        <p className="text-neutral-400 text-xs">
          Faça login com uma conta de gestor ou desenvolvedor para acessar.
        </p>
        <Link
          to="/login"
          className="inline-block py-2.5 px-6 bg-helpusOrange text-white font-bold text-xs rounded-xl hover:bg-[#d64a28] transition shadow"
        >
          Ir para Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header Admin ERP */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-helpusOrange">
            Suíte ERP Corporativa
          </span>
          <h1 className="text-3xl font-black text-white">Painel de Gestão Plural Locações</h1>
          <p className="text-neutral-400 text-sm">
            Gestão de romaneios, financeiro, emissão de contratos PDF, manutenção de acervo e configurações.
          </p>
        </div>

        {/* Abas ERP */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAbaAtiva("produtos")}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl transition ${
              abaAtiva === "produtos"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            📦 Catálogo & SKUs
          </button>

          <button
            onClick={() => setAbaAtiva("romaneio")}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl transition ${
              abaAtiva === "romaneio"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            🚚 Romaneio & Logística
          </button>

          <button
            onClick={() => setAbaAtiva("financeiro")}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl transition ${
              abaAtiva === "financeiro"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            💰 Financeiro & DRE
          </button>

          <button
            onClick={() => setAbaAtiva("manutencao")}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl transition ${
              abaAtiva === "manutencao"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            👨‍🔧 Manutenção
          </button>

          <button
            onClick={() => setAbaAtiva("usuarios")}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl transition ${
              abaAtiva === "usuarios"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            👥 Usuários
          </button>

          <button
            onClick={() => setAbaAtiva("configs")}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl transition ${
              abaAtiva === "configs"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            ⚙️ Configurações
          </button>
        </div>
      </div>

      {/* ABA 1: Catálogo de Produtos */}
      {abaAtiva === "produtos" && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <span className="font-bold text-white text-sm">Acervo de Equipamentos & SKUs</span>
              <button
                onClick={() => setModalProdutoAberto(true)}
                className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white text-xs font-bold rounded-xl shadow transition"
              >
                + Cadastrar Equipamento 📦
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">SKU / Produto</th>
                    <th className="p-4">Cor / Material</th>
                    <th className="p-4">Preço Diária</th>
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
                          <div className="font-mono text-[10px] text-helpusOrange font-bold">{prod.sku || "SKU"}</div>
                          <div className="font-bold text-white text-sm">{prod.nome}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-neutral-200">{prod.cor || "Padrão"}</div>
                        <div className="text-[11px] text-neutral-500">{prod.material || "Polipropileno"}</div>
                      </td>
                      <td className="p-4 font-bold text-white text-sm">
                        {formatCurrency(prod.precoDiaria)}
                      </td>
                      <td className="p-4 font-medium text-neutral-300">
                        {prod.estoque} un
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            if (confirm(`Deseja remover o equipamento "${prod.nome}"?`)) {
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
        </div>
      )}

      {/* ABA 2: Romaneio Logístico & Contrato PDF */}
      {abaAtiva === "romaneio" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Romaneio Logístico de Entregas & Devoluções</h2>
          </div>

          {loadingDados ? (
            <div className="text-center py-12 text-neutral-400 text-sm">Carregando romaneios...</div>
          ) : pedidos.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400 text-xs">
              Nenhuma reserva cadastrada no momento.
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
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>👤 {order.clientName} ({order.whatsapp})</span>
                        <span className="text-helpusOrange font-mono">{order.orderNumber || order.id}</span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        📍 {order.address} ({order.neighborhood}) • 📅 {order.startDate} até {order.endDate} ({order.rentalDays}d)
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Botão de Contrato PDF */}
                      <button
                        onClick={() => setContratoModalOrder(order)}
                        className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                      >
                        <span>📄 Imprimir Contrato PDF</span>
                      </button>

                      {/* Botão Vistoria de Devolução */}
                      <button
                        onClick={() => {
                          setModalVistoriaOrder(order);
                          setDamagedNotes(order.damagedNotes || "");
                          setDamagedFee(order.damagedFee ? order.damagedFee.toString() : "0");
                        }}
                        className="py-1.5 px-3 bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 font-bold text-xs rounded-lg transition"
                      >
                        🔍 Vistoria de Devolução
                      </button>

                      <select
                        value={order.status}
                        onChange={(e) => handleMudarStatusPedido(order.id, e.target.value)}
                        className="bg-neutral-950 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-helpusOrange"
                      >
                        <option value="PENDING">⏳ Em Análise</option>
                        <option value="APPROVED">✅ Aprovado</option>
                        <option value="PREPARING">📦 Em Separação no Galpão</option>
                        <option value="OUT_FOR_DELIVERY">🚚 Saiu para Entrega</option>
                        <option value="DELIVERED">🎪 Entregue no Local</option>
                        <option value="RETURNED">🔍 Devolvido / Vistoriado</option>
                        <option value="COMPLETED">🏁 Finalizado</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      {order.damagedFee > 0 && (
                        <span className="text-amber-400 font-bold">
                          ⚠️ Taxa Avarias Cobrada: {formatCurrency(order.damagedFee)} ({order.damagedNotes})
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-neutral-400">Total Reserva: </span>
                      <strong className="text-base text-helpusOrange">{formatCurrency(order.totalPrice || order.total)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 3: Financeiro Completo & DRE */}
      {abaAtiva === "financeiro" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Demonstrativo de Resultado & Fluxo de Caixa</h2>
            <button
              onClick={() => setModalDespesaAberto(true)}
              className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow transition"
            >
              + Novo Lançamento (Pagar / Receber)
            </button>
          </div>

          {/* Cards de Métricas Financeiras */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <span className="text-xs text-neutral-400 font-medium">Entradas Totais (Faturamento)</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {formatCurrency(financeiroSummary?.totalIncome)}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <span className="text-xs text-neutral-400 font-medium">Saídas / Despesas Operacionais</span>
              <div className="text-3xl font-black text-red-400 mt-1">
                {formatCurrency(financeiroSummary?.totalExpense)}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <span className="text-xs text-neutral-400 font-medium">Lucro Líquido Real</span>
              <div className={`text-3xl font-black mt-1 ${financeiroSummary?.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(financeiroSummary?.netProfit)}
              </div>
            </div>
          </div>

          {/* Tabela de Transações */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-neutral-800 font-bold text-white text-sm">
              Lançamentos Financeiros Recentes
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Descrição</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {transacoes.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-950/50 transition">
                      <td className="p-4 font-bold text-white">{t.description}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px]">
                          {t.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold">
                        {t.type === "INCOME" ? (
                          <span className="text-emerald-400">↑ Entrada</span>
                        ) : (
                          <span className="text-red-400">↓ Despesa</span>
                        )}
                      </td>
                      <td className={`p-4 font-bold text-sm ${t.type === "INCOME" ? "text-emerald-400" : "text-red-400"}`}>
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="p-4 text-neutral-400">
                        {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: Manutenção de Acervo & Fornecedores */}
      {abaAtiva === "manutencao" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Controle de Manutenção do Acervo & Fornecedores</h2>
            <button
              onClick={() => setModalManutencaoAberto(true)}
              className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow transition"
            >
              + Bloquear Item para Manutenção 👨‍🔧
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-neutral-800 font-bold text-white text-sm">
              Itens Atualmente em Reparo / Manutenção
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Equipamento</th>
                    <th className="p-4">Qtd</th>
                    <th className="p-4">Descrição do Defeito</th>
                    <th className="p-4">Custo Conserto</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {manutencoes.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-950/50 transition">
                      <td className="p-4 font-bold text-white">{m.product?.name || "Equipamento"}</td>
                      <td className="p-4 font-bold">{m.quantity} un</td>
                      <td className="p-4 text-neutral-300">{m.issueDescription}</td>
                      <td className="p-4 font-bold text-amber-400">{formatCurrency(m.cost)}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: Gestão de Usuários */}
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
                    <th className="p-4">Perfil de Acesso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-950/50 transition">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 text-neutral-300">{u.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-neutral-800 text-helpusOrange font-bold">
                          {u.roleCode || "CLIENT"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 6: Configurações da Empresa */}
      {abaAtiva === "configs" && (
        <form onSubmit={handleSalvarSettings} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xl max-w-2xl">
          <h2 className="text-lg font-bold text-white border-b border-neutral-800 pb-3">
            ⚙️ Configurações Globais da Empresa
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Nome Fantasia da Empresa *</label>
              <input
                type="text"
                value={companySettings.companyName}
                onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Chave PIX Oficial *</label>
                <input
                  type="text"
                  value={companySettings.pixKey}
                  onChange={(e) => setCompanySettings({ ...companySettings, pixKey: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm font-mono text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">WhatsApp de Suporte *</label>
                <input
                  type="text"
                  value={companySettings.whatsappSupport}
                  onChange={(e) => setCompanySettings({ ...companySettings, whatsappSupport: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Endereço do Galpão de Retirada *</label>
              <input
                type="text"
                value={companySettings.warehouseAddress}
                onChange={(e) => setCompanySettings({ ...companySettings, warehouseAddress: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Termos e Regras de Devolução *</label>
              <textarea
                rows="3"
                value={companySettings.rentalTerms}
                onChange={(e) => setCompanySettings({ ...companySettings, rentalTerms: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold rounded-xl shadow transition"
            >
              Salvar Configurações Globais ⚙️
            </button>
          </div>
        </form>
      )}

      {/* Modal Contrato PDF */}
      {contratoModalOrder && (
        <ContratoPDF
          order={contratoModalOrder}
          companySettings={companySettings}
          onClose={() => setContratoModalOrder(null)}
        />
      )}

      {/* Modal Form Vistoria */}
      {modalVistoriaOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSalvarVistoria} className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg border-b border-neutral-800 pb-2">
              🔍 Vistoria de Retorno — #{modalVistoriaOrder.orderNumber || modalVistoriaOrder.id}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Relatório de Avarias / Peças Faltantes</label>
                <textarea
                  rows="3"
                  placeholder="Ex: 2 cadeiras devolvidas com arranhões profundos e 1 toalha manchada."
                  value={damagedNotes}
                  onChange={(e) => setDamagedNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Taxa de Avaria a Cobrar (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={damagedFee}
                  onChange={(e) => setDamagedFee(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-sm font-bold text-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setModalVistoriaOrder(null)}
                className="py-2 px-4 bg-neutral-800 text-neutral-300 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-helpusOrange text-white font-bold rounded-xl shadow"
              >
                Salvar Vistoria & Romaneio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Form Despesa/Entrada */}
      {modalDespesaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSalvarDespesa} className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg border-b border-neutral-800 pb-2">
              💰 Novo Lançamento Financeiro
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Tipo de Lançamento *</label>
                <select
                  value={despesaTipo}
                  onChange={(e) => setDespesaTipo(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-sm font-bold"
                >
                  <option value="EXPENSE">↓ Saída / Despesa Operacional</option>
                  <option value="INCOME">↑ Entrada / Receita de Locação</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Descrição do Lançamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Compra de 20 novas cadeiras Tiffany"
                  value={despesaDesc}
                  onChange={(e) => setDespesaDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={despesaValor}
                  onChange={(e) => setDespesaValor(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-sm font-bold text-emerald-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setModalDespesaAberto(false)}
                className="py-2 px-4 bg-neutral-800 text-neutral-300 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-helpusOrange text-white font-bold rounded-xl shadow"
              >
                Registrar no Financeiro
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Form Manutenção */}
      {modalManutencaoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSalvarManutencao} className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg border-b border-neutral-800 pb-2">
              👨‍🔧 Bloquear Equipamento para Manutenção
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Equipamento *</label>
                <select
                  value={manutProdId}
                  onChange={(e) => setManutProdId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-sm"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Quantidade *</label>
                <input
                  type="number"
                  required
                  value={manutQtd}
                  onChange={(e) => setManutQtd(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Descrição do Defeito / Motivo *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Ex: Cadeira trincada no encosto necessitando de solda"
                  value={manutDesc}
                  onChange={(e) => setManutDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Custo Estimado do Conserto (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={manutCusto}
                  onChange={(e) => setManutCusto(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-sm text-amber-400 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setModalManutencaoAberto(false)}
                className="py-2 px-4 bg-neutral-800 text-neutral-300 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-helpusOrange text-white font-bold rounded-xl shadow"
              >
                Salvar Manutenção
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
