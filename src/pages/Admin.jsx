import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import ContratoPDF from "../components/ContratoPDF.jsx";
import OrcamentoPDF from "../components/OrcamentoPDF.jsx";
import ReciboPDF from "../components/ReciboPDF.jsx";

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user, token, isAdmin, isDeveloper } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState("produtos"); // "produtos", "romaneio", "financeiro", "relatorios", "manutencao", "usuarios", "configs"
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [financeiroSummary, setFinanceiroSummary] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  
  // Relatórios BI
  const [topProductsReport, setTopProductsReport] = useState([]);
  const [neighborhoodReport, setNeighborhoodReport] = useState([]);
  const [occupancyReport, setOccupancyReport] = useState(null);

  const [companySettings, setCompanySettings] = useState({
    pixKey: "83999087188",
    companyName: "Plural Locações & Eventos",
    whatsappSupport: "(83) 99908-7188",
    warehouseAddress: "Av. Epitácio Pessoa, 1250 - Tambaú, João Pessoa - PB",
    depositPercent: "30%",
    rentalTerms: "A devolução deve ocorrer até às 12h do dia acordado."
  });

  const [loadingDados, setLoadingDados] = useState(false);

  // Modais de Impressão PDF
  const [contratoModalOrder, setContratoModalOrder] = useState(null);
  const [orcamentoModalOrder, setOrcamentoModalOrder] = useState(null);
  const [reciboModalOrder, setReciboModalOrder] = useState(null);

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

  // States Form Despesa
  const [despesaDesc, setDespesaDesc] = useState("");
  const [despesaValor, setDespesaValor] = useState("");
  const [despesaTipo, setDespesaTipo] = useState("EXPENSE");
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

  const fetchRelatoriosBI = async () => {
    setLoadingDados(true);
    try {
      const resTop = await fetch(`${API_BASE}/admin/reports/top-products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resNeigh = await fetch(`${API_BASE}/admin/reports/neighborhood-revenue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resOcc = await fetch(`${API_BASE}/admin/reports/occupancy`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resTop.ok) setTopProductsReport(await resTop.json());
      if (resNeigh.ok) setNeighborhoodReport(await resNeigh.json());
      if (resOcc.ok) setOccupancyReport(await resOcc.json());
    } catch (e) {
      console.warn("Erro ao carregar relatórios BI:", e);
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
    if (abaAtiva === "relatorios") fetchRelatoriosBI();
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
            Gestão de orçamentos, recibos, contratos PDF, relatórios BI e financeiro corporativo.
          </p>
        </div>

        {/* Abas ERP */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAbaAtiva("produtos")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "produtos"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            📦 Catálogo
          </button>

          <button
            onClick={() => setAbaAtiva("romaneio")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "romaneio"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            🚚 Romaneio & Documentos
          </button>

          <button
            onClick={() => setAbaAtiva("financeiro")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "financeiro"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            💰 Financeiro
          </button>

          <button
            onClick={() => setAbaAtiva("relatorios")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "relatorios"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            📊 Relatórios & BI
          </button>

          <button
            onClick={() => setAbaAtiva("manutencao")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "manutencao"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            👨‍🔧 Manutenção
          </button>

          <button
            onClick={() => setAbaAtiva("usuarios")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "usuarios"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            👥 Usuários
          </button>

          <button
            onClick={() => setAbaAtiva("configs")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "configs"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            ⚙️ Configurações
          </button>
        </div>
      </div>

      {/* ABA 1: Catálogo */}
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

      {/* ABA 2: Romaneios & Emissão de Documentos PDF */}
      {abaAtiva === "romaneio" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Romaneio Logístico & Emissão de Documentos Fiscais</h2>
          </div>

          {loadingDados ? (
            <div className="text-center py-12 text-neutral-400 text-sm">Carregando reservas...</div>
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

                    {/* Tríade de Emissão de Documentos PDF */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setOrcamentoModalOrder(order)}
                        className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        📋 Orçamento PDF
                      </button>

                      <button
                        onClick={() => setContratoModalOrder(order)}
                        className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        📄 Contrato PDF
                      </button>

                      <button
                        onClick={() => setReciboModalOrder(order)}
                        className="py-1.5 px-3 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 text-emerald-300 font-bold text-xs rounded-lg transition"
                      >
                        🧾 Recibo PDF
                      </button>

                      <button
                        onClick={() => {
                          setModalVistoriaOrder(order);
                          setDamagedNotes(order.damagedNotes || "");
                          setDamagedFee(order.damagedFee ? order.damagedFee.toString() : "0");
                        }}
                        className="py-1.5 px-3 bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 font-bold text-xs rounded-lg transition"
                      >
                        🔍 Vistoria
                      </button>

                      <select
                        value={order.status}
                        onChange={(e) => handleMudarStatusPedido(order.id, e.target.value)}
                        className="bg-neutral-950 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-helpusOrange"
                      >
                        <option value="PENDING">⏳ Em Análise</option>
                        <option value="APPROVED">✅ Aprovado</option>
                        <option value="PREPARING">📦 Em Separação</option>
                        <option value="OUT_FOR_DELIVERY">🚚 Em Entrega</option>
                        <option value="DELIVERED">🎪 Entregue</option>
                        <option value="RETURNED">🔍 Devolvido</option>
                        <option value="COMPLETED">🏁 Finalizado</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      {order.damagedFee > 0 && (
                        <span className="text-amber-400 font-bold">
                          ⚠️ Taxa Avarias: {formatCurrency(order.damagedFee)} ({order.damagedNotes})
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

      {/* ABA 3: Financeiro Completo */}
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
        </div>
      )}

      {/* ABA 4: Relatórios & BI */}
      {abaAtiva === "relatorios" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">Central de Inteligência de Negócio & Relatórios BI</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ranking de Produtos */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm border-b border-neutral-800 pb-2">
                🏆 Ranking de Equipamentos Mais Alugados
              </h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {topProductsReport.map((p, idx) => (
                  <div key={p.id} className="flex justify-between items-center text-xs p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-helpusOrange font-mono w-5">#{idx + 1}</span>
                      <span className="font-bold text-white">{p.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">{p.totalRentedQuantity} unidades</div>
                      <div className="text-[10px] text-neutral-500">{formatCurrency(p.totalRevenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faturamento por Bairro */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm border-b border-neutral-800 pb-2">
                📍 Faturamento por Bairro (João Pessoa)
              </h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {neighborhoodReport.map((n) => (
                  <div key={n.neighborhood} className="flex justify-between items-center text-xs p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                    <div>
                      <div className="font-bold text-white">{n.neighborhood}</div>
                      <div className="text-[10px] text-neutral-500">{n.ordersCount} reservas realizadas</div>
                    </div>
                    <div className="font-bold text-helpusOrange text-sm">
                      {formatCurrency(n.totalRevenue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: Manutenção */}
      {abaAtiva === "manutencao" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Controle de Manutenção do Acervo</h2>
            <button
              onClick={() => setModalManutencaoAberto(true)}
              className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow transition"
            >
              + Bloquear Item para Manutenção 👨‍🔧
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-neutral-800 font-bold text-white text-sm">
              Itens em Reparo
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Equipamento</th>
                    <th className="p-4">Qtd</th>
                    <th className="p-4">Motivo</th>
                    <th className="p-4">Custo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {manutencoes.map((m) => (
                    <tr key={m.id}>
                      <td className="p-4 font-bold text-white">{m.product?.name}</td>
                      <td className="p-4 font-bold">{m.quantity} un</td>
                      <td className="p-4 text-neutral-300">{m.issueDescription}</td>
                      <td className="p-4 font-bold text-amber-400">{formatCurrency(m.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 6: Usuários */}
      {abaAtiva === "usuarios" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Gestão de Usuários</h2>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-neutral-300">
              <tbody className="divide-y divide-neutral-800/60">
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 text-neutral-300">{u.email}</td>
                    <td className="p-4 text-helpusOrange font-bold">{u.roleCode || "CLIENT"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 7: Configurações */}
      {abaAtiva === "configs" && (
        <form onSubmit={handleSalvarSettings} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl max-w-2xl text-xs">
          <h2 className="text-lg font-bold text-white border-b border-neutral-800 pb-3">⚙️ Configurações Globais</h2>
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Chave PIX Oficial *</label>
            <input
              type="text"
              value={companySettings.pixKey}
              onChange={(e) => setCompanySettings({ ...companySettings, pixKey: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-sm font-mono text-emerald-400"
            />
          </div>
          <button type="submit" className="py-3 px-6 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold rounded-xl shadow">
            Salvar Configurações
          </button>
        </form>
      )}

      {/* Modais de Impressão PDF */}
      {contratoModalOrder && (
        <ContratoPDF
          order={contratoModalOrder}
          companySettings={companySettings}
          onClose={() => setContratoModalOrder(null)}
        />
      )}

      {orcamentoModalOrder && (
        <OrcamentoPDF
          order={orcamentoModalOrder}
          companySettings={companySettings}
          onClose={() => setOrcamentoModalOrder(null)}
        />
      )}

      {reciboModalOrder && (
        <ReciboPDF
          order={reciboModalOrder}
          companySettings={companySettings}
          onClose={() => setReciboModalOrder(null)}
        />
      )}
    </div>
  );
}
