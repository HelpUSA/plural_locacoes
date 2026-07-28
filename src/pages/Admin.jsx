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
  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false);
  const [modalEditarUsuarioAberto, setModalEditarUsuarioAberto] = useState(false);
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
            Gestão de orçamentos, recibos, contratos PDF, relatórios BI e edição completa de usuários.
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
            📦 Catálogo ({products.length})
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
            onClick={() => setAbaAtiva("usuarios")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              abaAtiva === "usuarios"
                ? "bg-helpusOrange text-white shadow-md"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            👥 Usuários ({usuarios.length})
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
    </div>
  );
}
