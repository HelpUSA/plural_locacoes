import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import ContratoPDF from "../components/ContratoPDF.jsx";
import OrcamentoPDF from "../components/OrcamentoPDF.jsx";
import ReciboPDF from "../components/ReciboPDF.jsx";

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user, token, isAdmin } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState("produtos"); // "produtos", "categorias", "romaneio", "financeiro", "relatorios", "manutencao", "usuarios", "configs"
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

  // Configurações
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
  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false);
  const [modalEditarUsuarioAberto, setModalEditarUsuarioAberto] = useState(false);
  const [modalVistoriaOrder, setModalVistoriaOrder] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Form State Produto
  const [sku, setSku] = useState("");
  const [nome, setNome] = useState("");
  const [departamento, setDepartamento] = useState("mobiliario-lounges");
  const [categoria, setCategoria] = useState("mesas-bancadas");
  const [grupo, setGrupo] = useState("mesas-redondas");
  const [precoDiaria, setPrecoDiaria] = useState("");
  const [precoSemanal, setPrecoSemanal] = useState("");
  const [imagem, setImagem] = useState("/mesas-e-cadeiras-01.jpeg");
  const [descricao, setDescricao] = useState("");
  const [cor, setCor] = useState("");
  const [material, setMaterial] = useState("");
  const [dimensoes, setDimensoes] = useState("");
  const [pesoSuportado, setPesoSuportado] = useState("");
  const [estoque, setEstoque] = useState("50");
  const [destaque, setDestaque] = useState("");
  const [isKit, setIsKit] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  // Form State Categoria/Grupo
  const [novaCatNome, setNovaCatNome] = useState("");
  const [categoriasLocais, setCategoriasLocais] = useState([
    { id: "c1", name: "Assentos & Cadeiras", department: "Mobiliário & Lounges" },
    { id: "c2", name: "Mesas & Bancadas", department: "Mobiliário & Lounges" },
    { id: "c3", name: "Tendas & Coberturas", department: "Estruturas & Climatização" },
    { id: "c4", name: "Climatização & Iluminação", department: "Estruturas & Climatização" },
    { id: "c5", name: "Mesa Posta & Panaria", department: "Gastronomia & Enxoval" },
    { id: "c6", name: "Combos & Kits Prontos", department: "Kits & Sugestões de Ambientes" }
  ]);

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

  // Form State Novo Usuário
  const [novoUserNome, setNovoUserNome] = useState("");
  const [novoUserEmail, setNovoUserEmail] = useState("");
  const [novoUserSenha, setNovoUserSenha] = useState("@dmLocal1993");
  const [novoUserFone, setNovoUserFone] = useState("(83) 99908-7188");
  const [novoUserRole, setNovoUserRole] = useState("CLIENT");

  // Form State Editar Usuário
  const [editUserNome, setEditUserNome] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserFone, setEditUserFone] = useState("");
  const [editUserRole, setEditUserRole] = useState("CLIENT");
  const [editUserNovaSenha, setEditUserNovaSenha] = useState("");

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
    fetchPedidos();
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (abaAtiva === "romaneio") fetchPedidos();
    if (abaAtiva === "usuarios") fetchUsuarios();
    if (abaAtiva === "financeiro") fetchFinanceiro();
    if (abaAtiva === "relatorios") fetchRelatoriosBI();
    if (abaAtiva === "manutencao") fetchManutencao();
  }, [abaAtiva]);

  const abrirModalCriarProduto = () => {
    setProdutoEditando(null);
    setSku(`SKU-${Date.now().toString().slice(-6)}`);
    setNome("");
    setDepartamento("mobiliario-lounges");
    setCategoria("mesas-bancadas");
    setGrupo("mesas-redondas");
    setPrecoDiaria("");
    setPrecoSemanal("");
    setImagem("/mesas-e-cadeiras-01.jpeg");
    setDescricao("");
    setCor("Preta / Branca");
    setMaterial("Polipropileno Virgem");
    setDimensoes("42cm x 88cm x 45cm");
    setPesoSuportado("INMETRO 182 kg");
    setEstoque("50");
    setDestaque("");
    setIsKit(false);
    setModalProdutoAberto(true);
  };

  const abrirModalEditarProduto = (prod) => {
    setProdutoEditando(prod);
    setSku(prod.sku || `SKU-${prod.id.slice(-6)}`);
    setNome(prod.nome || prod.name);
    setDepartamento(prod.departamento || "mobiliario-lounges");
    setCategoria(prod.categoria || "mesas-bancadas");
    setGrupo(prod.grupo || "mesas-redondas");
    setPrecoDiaria((prod.precoDiaria || prod.priceDaily || "").toString());
    setPrecoSemanal((prod.precoSemanal || prod.priceWeekly || "").toString());
    setImagem(prod.imagem || prod.image || "/mesas-e-cadeiras-01.jpeg");
    setDescricao(prod.descricao || prod.description || "");
    setCor(prod.cor || prod.color || "");
    setMaterial(prod.material || "");
    setDimensoes(prod.dimensoes || prod.dimensions || "");
    setPesoSuportado(prod.pesoSuportado || prod.maxWeight || "");
    setEstoque((prod.estoque || prod.stock || 50).toString());
    setDestaque(prod.destaque || prod.highlight || "");
    setIsKit(!!prod.isKit);
    setModalProdutoAberto(true);
  };

  const handleSalvarProdutoSubmit = (e) => {
    e.preventDefault();

    const dados = {
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      nome,
      departamento,
      categoria,
      grupo,
      precoDiaria: parseFloat(precoDiaria) || 0,
      precoSemanal: parseFloat(precoSemanal) || 0,
      imagem: imagem || "/mesas-e-cadeiras-01.jpeg",
      descricao,
      cor,
      material,
      dimensoes,
      pesoSuportado,
      estoque: parseInt(estoque, 10) || 50,
      destaque,
      isKit
    };

    if (produtoEditando) {
      updateProduct(produtoEditando.id, dados);
    } else {
      addProduct(dados);
    }

    setModalProdutoAberto(false);
    alert(`Equipamento "${nome}" salvo com sucesso!`);
  };

  const handleCadastrarUsuarioSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: novoUserNome,
          email: novoUserEmail,
          password: novoUserSenha,
          phone: novoUserFone,
          roleCode: novoUserRole
        })
      });

      if (res.ok) {
        const u = await res.json();
        setUsuarios(prev => [u, ...prev]);
        setModalUsuarioAberto(false);
        setNovoUserNome("");
        setNovoUserEmail("");
        alert(`Usuário "${u.name}" cadastrado com sucesso!`);
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao cadastrar usuário.");
      }
    } catch (e) {
      alert("Erro ao cadastrar usuário.");
    }
  };

  const abrirModalEditarUsuario = (u) => {
    setUsuarioEditando(u);
    setEditUserNome(u.name || "");
    setEditUserEmail(u.email || "");
    setEditUserFone(u.phone || "");
    setEditUserRole(u.roleCode || "CLIENT");
    setEditUserNovaSenha("");
    setModalEditarUsuarioAberto(true);
  };

  const handleSalvarEdicaoUsuarioSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioEditando) return;

    try {
      const bodyData = {
        name: editUserNome,
        email: editUserEmail,
        phone: editUserFone,
        roleCode: editUserRole
      };

      if (editUserNovaSenha.trim()) {
        bodyData.password = editUserNovaSenha;
      }

      const res = await fetch(`${API_BASE}/admin/users/${usuarioEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      if (res.ok) {
        const updated = await res.json();
        setUsuarios(prev => prev.map(u => (u.id === usuarioEditando.id ? { ...u, ...updated } : u)));
        setModalEditarUsuarioAberto(false);
        setUsuarioEditando(null);
        alert(`Dados do usuário "${editUserNome}" atualizados com sucesso!`);
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao atualizar dados do usuário.");
      }
    } catch (e) {
      alert("Erro ao atualizar usuário.");
    }
  };

  const handleAlterarRoleUsuario = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ roleCode: newRole })
      });

      if (res.ok) {
        setUsuarios(prev => prev.map(u => (u.id === userId ? { ...u, roleCode: newRole } : u)));
      }
    } catch (e) {
      console.warn("Erro ao atualizar papel:", e);
    }
  };

  const handleExcluirUsuario = async (userId, userEmail) => {
    if (!confirm(`Deseja realmente excluir o usuário "${userEmail}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setUsuarios(prev => prev.filter(u => u.id !== userId));
        alert("Usuário excluído com sucesso!");
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao excluir.");
      }
    } catch (e) {
      alert("Erro ao excluir usuário.");
    }
  };

  const handleCadastrarCategoriaSubmit = (e) => {
    e.preventDefault();
    if (!novaCatNome.trim()) return;

    const nova = {
      id: `c-${Date.now()}`,
      name: novaCatNome,
      department: "Mobiliário & Lounges"
    };

    setCategoriasLocais(prev => [...prev, nova]);
    setNovaCatNome("");
    alert(`Categoria "${novaCatNome}" criada com sucesso!`);
  };

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
            Gestão de orçamentos, recibos, contratos PDF, relatórios BI, controle financeiro e usuários.
          </p>
        </div>

        {/* Todas as 8 Abas ERP Reativadas */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAbaAtiva("produtos")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "produtos"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            📦 Catálogo ({products.length})
          </button>

          <button
            onClick={() => setAbaAtiva("categorias")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "categorias"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            🏷️ Categorias & Grupos
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
            📊 Relatórios BI
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
            👥 Usuários ({usuarios.length})
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
                onClick={abrirModalCriarProduto}
                className="py-2.5 px-5 bg-helpusOrange hover:bg-[#d64a28] text-white text-xs font-bold rounded-xl shadow transition"
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
                          onClick={() => abrirModalEditarProduto(prod)}
                          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition"
                        >
                          Editar
                        </button>
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

      {/* ABA 2: Categorias & Grupos */}
      {abaAtiva === "categorias" && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white border-b border-neutral-800 pb-3">🏷️ Gestão de Categorias e Grupos</h2>
            
            <form onSubmit={handleCadastrarCategoriaSubmit} className="flex gap-3 max-w-md">
              <input
                type="text"
                required
                placeholder="Nova Categoria (Ex: Iluminação Cênica)"
                value={novaCatNome}
                onChange={(e) => setNovaCatNome(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-xs"
              />
              <button type="submit" className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow">
                + Adicionar Categoria
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {categoriasLocais.map((c) => (
                <div key={c.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{c.name}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">ID: {c.id}</span>
                  </div>
                  <div className="text-xs text-helpusOrange font-semibold">{c.department}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: Romaneio & Documentos */}
      {abaAtiva === "romaneio" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Romaneio de Entrega, Retorno e Emissão de Documentos PDF</h2>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Nº Pedido</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Período Evento</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Documentos PDF</th>
                    <th className="p-4 text-right">Vistoria / Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {pedidos.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-950/50 transition">
                      <td className="p-4 font-mono font-bold text-helpusOrange">
                        #{o.orderNumber || o.id.slice(0, 8)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{o.customerName}</div>
                        <div className="text-[11px] text-neutral-500">{o.customerPhone}</div>
                      </td>
                      <td className="p-4">
                        <div>{new Date(o.eventStartDate).toLocaleDateString("pt-BR")} até {new Date(o.eventEndDate).toLocaleDateString("pt-BR")}</div>
                      </td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleMudarStatusPedido(o.id, e.target.value)}
                          className="bg-neutral-950 border border-neutral-700 text-white rounded-lg px-2 py-1 text-xs font-bold"
                        >
                          <option value="PRE_RESERVED">📋 Pré-Reserva (Orçamento)</option>
                          <option value="CONFIRMED">✅ Confirmado (Sinal 30% Pago)</option>
                          <option value="OUT_FOR_DELIVERY">🚚 Saiu para Entrega</option>
                          <option value="DELIVERED">📍 Entregue no Local</option>
                          <option value="RETURNED">🏁 Devolvido / Vistoriado</option>
                          <option value="CANCELLED">❌ Cancelado</option>
                        </select>
                      </td>
                      <td className="p-4 text-center space-x-1">
                        <button
                          onClick={() => setOrcamentoModalOrder(o)}
                          className="py-1 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold rounded-lg transition text-[11px]"
                        >
                          📄 Orçamento
                        </button>
                        <button
                          onClick={() => setContratoModalOrder(o)}
                          className="py-1 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold rounded-lg transition text-[11px]"
                        >
                          📜 Contrato A4
                        </button>
                        <button
                          onClick={() => setReciboModalOrder(o)}
                          className="py-1 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold rounded-lg transition text-[11px]"
                        >
                          🧾 Recibo
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setModalVistoriaOrder(o)}
                          className="py-1.5 px-3 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-600/60 text-amber-300 font-bold rounded-lg transition text-xs"
                        >
                          🔍 Vistoria de Retorno
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

      {/* ABA 4: Financeiro */}
      {abaAtiva === "financeiro" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs text-neutral-400 font-semibold uppercase">Faturamento Bruto</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {formatCurrency(financeiroSummary?.totalRevenue || 0)}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs text-neutral-400 font-semibold uppercase">Total Despesas</span>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {formatCurrency(financeiroSummary?.totalExpenses || 0)}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs text-neutral-400 font-semibold uppercase">Resultado Líquido</span>
              <div className="text-2xl font-black text-helpusOrange mt-1">
                {formatCurrency(financeiroSummary?.netProfit || 0)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <h3 className="font-bold text-white text-base">Extrato de Transações Financeiras</h3>
            <button
              onClick={() => setModalDespesaAberto(true)}
              className="py-2 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow transition"
            >
              + Lançar Receita / Despesa 💰
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Descrição</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {transacoes.map((t) => (
                    <tr key={t.id}>
                      <td className="p-4 font-bold text-white">{t.description}</td>
                      <td className="p-4 text-neutral-400">{t.category}</td>
                      <td className="p-4">
                        <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${t.type === 'INCOME' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {t.type === 'INCOME' ? 'RECEITA' : 'DESPESA'}
                        </span>
                      </td>
                      <td className={`p-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: Relatórios BI */}
      {abaAtiva === "relatorios" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">Central de Inteligência de Negócios (BI)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm border-b border-neutral-800 pb-2">
                🏆 Top Equipamentos Mais Alugados
              </h3>
              <div className="space-y-3">
                {topProductsReport.map((p, idx) => (
                  <div key={p.productId} className="flex justify-between items-center text-xs p-2 bg-neutral-950 rounded-xl border border-neutral-800">
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

      {/* ABA 6: Manutenção */}
      {abaAtiva === "manutencao" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Controle de Manutenção do Acervo</h2>
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

      {/* ABA 7: Gestão Completa & Edição de Usuários (RBAC + Dados) */}
      {abaAtiva === "usuarios" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Gestão de Usuários & Níveis de Acesso (RBAC)</h2>
              <p className="text-neutral-400 text-xs">
                Edite nomes, e-mails, telefones de contato e níveis de permissão dos cadastrados.
              </p>
            </div>
            <button
              onClick={() => setModalUsuarioAberto(true)}
              className="py-2.5 px-5 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow transition"
            >
              + Cadastrar Novo Usuário 👤
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Usuário / Nome</th>
                    <th className="p-4">E-mail</th>
                    <th className="p-4">Telefone / WhatsApp</th>
                    <th className="p-4">Perfil de Acesso</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-950/50 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <span>👤</span>
                        <span>{u.name}</span>
                      </td>
                      <td className="p-4 text-neutral-300 font-mono text-[11px]">{u.email}</td>
                      <td className="p-4 text-emerald-400 font-mono font-bold">{u.phone || "(83) 99908-7188"}</td>
                      <td className="p-4">
                        <select
                          value={u.roleCode || "CLIENT"}
                          onChange={(e) => handleAlterarRoleUsuario(u.id, e.target.value)}
                          className="bg-neutral-950 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-helpusOrange"
                        >
                          <option value="DEVELOPER">👑 DEVELOPER (SuperAdmin)</option>
                          <option value="STORE_OWNER">🏢 STORE_OWNER (Dono/Gerente)</option>
                          <option value="OPERATOR">👷 OPERATOR (Funcionário/Estoque)</option>
                          <option value="CLIENT">👤 CLIENT (Cliente Final)</option>
                        </select>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => abrirModalEditarUsuario(u)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold rounded-lg transition"
                        >
                          ✏️ Editar Dados
                        </button>
                        <button
                          onClick={() => handleExcluirUsuario(u.id, u.email)}
                          className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 font-bold rounded-lg transition"
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

      {/* ABA 8: Configurações */}
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

      {/* MODAL CADASTRAR NOVO USUÁRIO */}
      {modalUsuarioAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white">➕ Cadastrar Novo Usuário</h3>
              <button onClick={() => setModalUsuarioAberto(false)} className="text-neutral-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCadastrarUsuarioSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Wagner Santos"
                  value={novoUserNome}
                  onChange={(e) => setNovoUserNome(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  required
                  placeholder="wagner.redes@gmail.com"
                  value={novoUserEmail}
                  onChange={(e) => setNovoUserEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Senha Inicial *</label>
                <input
                  type="password"
                  required
                  value={novoUserSenha}
                  onChange={(e) => setNovoUserSenha(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  value={novoUserFone}
                  onChange={(e) => setNovoUserFone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Perfil de Permissão (Role) *</label>
                <select
                  value={novoUserRole}
                  onChange={(e) => setNovoUserRole(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="DEVELOPER">👑 DEVELOPER (SuperAdmin Geral)</option>
                  <option value="STORE_OWNER">🏢 STORE_OWNER (Dono/Gerente da Loja)</option>
                  <option value="OPERATOR">👷 OPERATOR (Funcionário/Estoque)</option>
                  <option value="CLIENT">👤 CLIENT (Cliente Final)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalUsuarioAberto(false)}
                  className="py-2 px-4 bg-neutral-800 text-neutral-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-helpusOrange text-white font-bold rounded-xl shadow"
                >
                  Cadastrar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR DADOS DO USUÁRIO */}
      {modalEditarUsuarioAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white">✏️ Editar Usuário: {usuarioEditando?.name}</h3>
              <button onClick={() => setModalEditarUsuarioAberto(false)} className="text-neutral-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarEdicaoUsuarioSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={editUserNome}
                  onChange={(e) => setEditUserNome(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  value={editUserFone}
                  onChange={(e) => setEditUserFone(e.target.value)}
                  placeholder="(83) 99908-7188"
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Perfil de Acesso *</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="DEVELOPER">👑 DEVELOPER (SuperAdmin Geral)</option>
                  <option value="STORE_OWNER">🏢 STORE_OWNER (Dono/Gerente da Loja)</option>
                  <option value="OPERATOR">👷 OPERATOR (Funcionário/Estoque)</option>
                  <option value="CLIENT">👤 CLIENT (Cliente Final)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Redefinir Senha (opcional)</label>
                <input
                  type="password"
                  placeholder="Deixe em branco para não alterar"
                  value={editUserNovaSenha}
                  onChange={(e) => setEditUserNovaSenha(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalEditarUsuarioAberto(false)}
                  className="py-2 px-4 bg-neutral-800 text-neutral-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-helpusOrange text-white font-bold rounded-xl shadow"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRAR / EDITAR PRODUTO */}
      {modalProdutoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 text-white space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white">
                {produtoEditando ? "Editar Equipamento" : "Novo Equipamento para Locação"}
              </h3>
              <button onClick={() => setModalProdutoAberto(false)} className="text-neutral-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarProdutoSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Código SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-xs font-mono text-helpusOrange"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-neutral-400 mb-1">Nome do Equipamento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cadeira Tiffany Dourada"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalProdutoAberto(false)}
                  className="py-2 px-4 bg-neutral-800 text-neutral-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-helpusOrange text-white font-bold rounded-xl shadow"
                >
                  Salvar Equipamento
                </button>
              </div>
            </form>
          </div>
        </div>
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
