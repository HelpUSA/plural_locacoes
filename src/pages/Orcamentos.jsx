import React, { useState } from "react";
import { useCart, BAIRROS_FRETE } from "../context/CartContext.jsx";
import { useProducts } from "../context/ProductContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Orcamentos() {
  const { products } = useProducts();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const {
    cartItems,
    addToCart,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    diasLocacao,
    bairroSelecionado,
    setBairroSelecionado,
    subtotalLocacao,
    taxaFrete,
    valorTotalEstimado,
    saveOrderToDB,
    clearCart,
    removeItem,
    updateQuantity
  } = useCart();

  // Estado do Wizard Guiado (Passos 1 a 4)
  const [passoAtual, setPassoAtual] = useState(1);

  // Passo 1: Perfil do Evento
  const [tipoEvento, setTipoEvento] = useState("casamento");
  const [qtdConvidados, setQtdConvidados] = useState(50);

  // Passo 3: Dados de Contato / Entrega
  const [nome, setNome] = useState(user?.name || "");
  const [whatsapp, setWhatsapp] = useState(user?.phone || "");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [enviando, setEnviando] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  const tiposEventos = [
    { id: "casamento", nome: "💒 Casamento / Recepção", desc: "Sugerimos Cadeiras Tiffany/Dior, Mesas Redondas e Tendas" },
    { id: "churrasco", nome: "🥩 Churrasco / Aniversário", desc: "Sugerimos Mesas Plásticas, Climatizadores e Tendas" },
    { id: "corporativo", nome: "💼 Feira / Congresso / Empresa", desc: "Sugerimos Mesas Pranchão, Cadeiras Tolix e Climatizadores" },
    { id: "coquetel", nome: "🍸 Coquetel / Lounge Beira Mar", desc: "Sugerimos Bistrôs de Vidro, Banquetas Inox e Iluminação LED" }
  ];

  // Função de Sugestão Automática de Equipamentos baseada em Convidados
  const aplicarSugestaoAutomatica = () => {
    // Limpar itens anteriores do carrinho para aplicar a nova sugestão
    clearCart();

    const qtdMesas = Math.ceil(qtdConvidados / 10);
    const qtdCadeiras = qtdConvidados;

    if (tipoEvento === "casamento") {
      const mesa = products.find((p) => p.nome.toLowerCase().includes("redonda")) || products[0];
      const cadeira = products.find((p) => p.nome.toLowerCase().includes("tiffany")) || products[1];
      const tenda = products.find((p) => p.nome.toLowerCase().includes("tenda")) || products[2];

      if (mesa) addToCart(mesa, qtdMesas, []);
      if (cadeira) addToCart(cadeira, qtdCadeiras, []);
      if (tenda && qtdConvidados > 40) addToCart(tenda, 1, []);
    } else if (tipoEvento === "coquetel") {
      const bistro = products.find((p) => p.nome.toLowerCase().includes("bistrô")) || products[0];
      if (bistro) addToCart(bistro, Math.ceil(qtdConvidados / 4), []);
    } else {
      const mesa = products.find((p) => p.nome.toLowerCase().includes("retangular")) || products[0];
      const cadeira = products.find((p) => p.nome.toLowerCase().includes("tolix") || p.nome.toLowerCase().includes("cadeira")) || products[1];
      if (mesa) addToCart(mesa, Math.ceil(qtdConvidados / 6), []);
      if (cadeira) addToCart(cadeira, qtdCadeiras, []);
    }

    // Avançar para a etapa de personalização do acervo
    setPassoAtual(2);
  };

  const handleFinalizarSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Adicione pelo menos 1 equipamento ao seu orçamento!");
      return;
    }

    if (!nome || !whatsapp || !rua) {
      alert("Preencha seu Nome, WhatsApp e Rua de Entrega.");
      return;
    }

    setEnviando(true);

    const orderPayload = {
      clientName: nome,
      whatsapp,
      startDate: dataInicio,
      endDate: dataFim,
      rentalDays: diasLocacao,
      neighborhood: bairroSelecionado.nome,
      address: `${rua}, Nº ${numero || "S/N"}`,
      notes: `Tipo: ${tipoEvento} | Convidados: ~${qtdConvidados} | Obs: ${observacoes}`,
      items: cartItems,
      subtotal: subtotalLocacao,
      freightFee: taxaFrete,
      totalPrice: valorTotalEstimado
    };

    try {
      const savedOrder = await saveOrderToDB(orderPayload, token);
      clearCart();
      setEnviando(false);
      navigate("/confirmacao-pedido", { state: { order: savedOrder } });
    } catch (err) {
      console.error("Erro ao registrar orçamento:", err);
      alert("Houve uma falha ao salvar seu orçamento. Tente novamente.");
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header do Assistente Guiado */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-widest text-helpusOrange">
          Assistente Inteligente de Eventos
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Faça Seu Orçamento Guiado</h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Siga o passo a passo interativo. Nossa aplicação sugere a quantidade exata de mobília conforme seus convidados!
        </p>
      </div>

      {/* Barra de Progresso em 4 Etapas */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-xl">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div
            onClick={() => setPassoAtual(1)}
            className={`py-2 px-1 rounded-xl cursor-pointer font-bold transition border ${
              passoAtual === 1
                ? "bg-helpusOrange text-white border-helpusOrange shadow-lg"
                : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
            }`}
          >
            1. O Evento
          </div>
          <div
            onClick={() => setPassoAtual(2)}
            className={`py-2 px-1 rounded-xl cursor-pointer font-bold transition border ${
              passoAtual === 2
                ? "bg-helpusOrange text-white border-helpusOrange shadow-lg"
                : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
            }`}
          >
            2. Equipamentos
          </div>
          <div
            onClick={() => setPassoAtual(3)}
            className={`py-2 px-1 rounded-xl cursor-pointer font-bold transition border ${
              passoAtual === 3
                ? "bg-helpusOrange text-white border-helpusOrange shadow-lg"
                : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
            }`}
          >
            3. Localização
          </div>
          <div
            onClick={() => setPassoAtual(4)}
            className={`py-2 px-1 rounded-xl cursor-pointer font-bold transition border ${
              passoAtual === 4
                ? "bg-helpusOrange text-white border-helpusOrange shadow-lg"
                : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
            }`}
          >
            4. Resumo & PIX
          </div>
        </div>
      </div>

      {/* ===== ETAPA 1: O EVENTO & DATAS ===== */}
      {passoAtual === 1 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl animate-fadeIn">
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🎉</span> Qual o Tipo do seu Evento e Data?
            </h2>
            <p className="text-neutral-400 text-xs mt-1">
              Selecione o estilo do evento para o assistente calcular a proporção ideal de mesas e cadeiras.
            </p>
          </div>

          {/* Seleção do Tipo de Evento */}
          <div className="grid sm:grid-cols-2 gap-4">
            {tiposEventos.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setTipoEvento(evt.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                  tipoEvento === evt.id
                    ? "bg-helpusOrange/15 border-helpusOrange ring-1 ring-helpusOrange text-white shadow-lg"
                    : "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                <div className="font-bold text-sm">{evt.nome}</div>
                <div className="text-xs text-neutral-400 leading-relaxed">{evt.desc}</div>
              </div>
            ))}
          </div>

          {/* Número Estimado de Convidados & Datas */}
          <div className="grid sm:grid-cols-3 gap-4 border-t border-neutral-800/80 pt-6 text-xs">
            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Estimativa de Convidados:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={qtdConvidados}
                  onChange={(e) => setQtdConvidados(Number(e.target.value))}
                  className="w-full accent-helpusOrange"
                />
                <span className="bg-helpusOrange text-white px-3 py-1.5 rounded-xl font-black text-sm font-mono">
                  {qtdConvidados}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">Data de Entrega *</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 font-bold focus:outline-none focus:border-helpusOrange"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">Data de Devolução *</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-2.5 font-bold focus:outline-none focus:border-helpusOrange"
              />
            </div>
          </div>

          {/* Botões de Navegação */}
          <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
            <span className="text-xs text-neutral-400">
              Período: <strong className="text-white">{diasLocacao} {diasLocacao === 1 ? 'diária' : 'diárias'}</strong>
            </span>

            <button
              onClick={aplicarSugestaoAutomatica}
              className="py-3 px-6 bg-helpusOrange hover:bg-[#d64a28] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition transform hover:scale-[1.02] flex items-center gap-2"
            >
              <span>Gerar Sugestão Automática para {qtdConvidados} Pessoas</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ===== ETAPA 2: PERSONALIZAR EQUIPAMENTOS ===== */}
      {passoAtual === 2 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📦</span> Equipamentos Sugeridos para seu Evento
              </h2>
              <p className="text-neutral-400 text-xs mt-1">
                Ajuste as quantidades ou inclua novos itens do nosso acervo completo.
              </p>
            </div>

            <button
              onClick={() => setPassoAtual(1)}
              className="text-xs text-neutral-400 hover:text-white underline"
            >
              ← Alterar tipo de evento ({qtdConvidados} pessoas)
            </button>
          </div>

          {/* Lista de Itens no Orçamento Atual */}
          {cartItems.length > 0 && (
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <div className="text-xs font-bold text-helpusOrange uppercase tracking-wider">
                Itens Atualmente no Seu Pedido:
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {cartItems.map((it) => (
                  <div
                    key={it.itemKey}
                    className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{it.product.nome}</div>
                      <div className="text-[10px] text-neutral-400">{formatCurrency(it.precoUnitarioDiaria)} / diária</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-neutral-700 rounded bg-neutral-950">
                        <button
                          onClick={() => updateQuantity(it.itemKey, it.quantidade - 1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-white">{it.quantidade}</span>
                        <button
                          onClick={() => updateQuantity(it.itemKey, it.quantidade + 1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(it.itemKey)}
                        className="text-red-400 text-[11px] hover:underline"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adicionar Mais Produtos do Acervo */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase">Adicionar Outros Equipamentos:</h3>

            <div className="grid sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center gap-3"
                >
                  <img
                    src={p.imagem}
                    alt={p.nome}
                    className="w-12 h-12 object-cover rounded-lg border border-neutral-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-xs truncate">{p.nome}</div>
                    <div className="text-[11px] font-bold text-emerald-400">{formatCurrency(p.precoDiaria)}</div>
                    <button
                      onClick={() => addToCart(p, 1, [])}
                      className="mt-1 text-[10px] bg-helpusOrange/20 hover:bg-helpusOrange text-helpusOrange hover:text-white px-2 py-0.5 rounded font-bold transition w-full"
                    >
                      + Incluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Avanço */}
          <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
            <button
              onClick={() => setPassoAtual(1)}
              className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl"
            >
              ← Voltar Passo 1
            </button>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-white hidden sm:inline">
                Subtotal: <strong className="text-helpusOrange">{formatCurrency(subtotalLocacao)}</strong>
              </span>

              <button
                onClick={() => setPassoAtual(3)}
                disabled={cartItems.length === 0}
                className="py-3 px-6 bg-helpusOrange hover:bg-[#d64a28] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50"
              >
                Avançar para Localização →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ETAPA 3: LOCALIZAÇÃO & FRETE ===== */}
      {passoAtual === 3 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl animate-fadeIn">
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🚚</span> Onde Entregaremos seu Material em João Pessoa?
            </h2>
            <p className="text-neutral-400 text-xs mt-1">
              O frete e descarregamento é calculado dinamicamente de acordo com seu bairro.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Selecione o Bairro em João Pessoa *
              </label>
              <select
                value={bairroSelecionado.nome}
                onChange={(e) => {
                  const b = BAIRROS_FRETE.find((item) => item.nome === e.target.value);
                  if (b) setBairroSelecionado(b);
                }}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 font-bold focus:outline-none focus:border-helpusOrange"
              >
                {BAIRROS_FRETE.map((b) => (
                  <option key={b.nome} value={b.nome}>
                    {b.nome} — Taxa estimada: {formatCurrency(b.taxa)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">Rua / Av. *</label>
              <input
                type="text"
                required
                placeholder="Ex: Av. Cabo Branco, N 1400"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-helpusOrange"
              />
            </div>
          </div>

          {/* Dados Pessoais do Cliente */}
          <div className="grid sm:grid-cols-2 gap-4 border-t border-neutral-800/80 pt-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-300 mb-1">Seu Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Wagner Santos"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-helpusOrange font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">WhatsApp de Contato *</label>
              <input
                type="tel"
                required
                placeholder="(83) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-helpusOrange"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-300 text-xs mb-1">Observações do Evento</label>
            <textarea
              rows="2"
              placeholder="Ex: Horário preferencial de entrega, nome do salão de festas, etc."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-helpusOrange"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
            <button
              onClick={() => setPassoAtual(2)}
              className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl"
            >
              ← Voltar Passo 2
            </button>

            <button
              onClick={() => setPassoAtual(4)}
              disabled={!rua || !nome || !whatsapp}
              className="py-3 px-6 bg-helpusOrange hover:bg-[#d64a28] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50"
            >
              Avançar para Resumo Final →
            </button>
          </div>
        </div>
      )}

      {/* ===== ETAPA 4: RESUMO FINAL & EMISSÃO ===== */}
      {passoAtual === 4 && (
        <form
          onSubmit={handleFinalizarSubmit}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl animate-fadeIn"
        >
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📜</span> Resumo Comercial & Emissão do Orçamento
            </h2>
            <p className="text-neutral-400 text-xs mt-1">
              Confira os detalhes abaixo. Ao concluir, seu orçamento será gravado no sistema e o comprovante com QR Code PIX será gerado.
            </p>
          </div>

          {/* Dados do Evento */}
          <div className="grid sm:grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300">
            <div>
              <span className="text-neutral-500 font-semibold">Cliente:</span>{" "}
              <strong className="text-white">{nome} ({whatsapp})</strong>
            </div>
            <div>
              <span className="text-neutral-500 font-semibold">Local:</span>{" "}
              <strong className="text-white">{rua} ({bairroSelecionado.nome})</strong>
            </div>
            <div>
              <span className="text-neutral-500 font-semibold">Período:</span>{" "}
              <strong className="text-white">{dataInicio} até {dataFim} ({diasLocacao}d)</strong>
            </div>
            <div>
              <span className="text-neutral-500 font-semibold">Tipo / Convidados:</span>{" "}
              <strong className="text-white">{tipoEvento.toUpperCase()} (~{qtdConvidados} pessoas)</strong>
            </div>
          </div>

          {/* Itens Solicitados */}
          <div className="space-y-2 text-xs">
            <div className="font-bold text-neutral-300 uppercase">Itens Solicitados:</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {cartItems.map((it, idx) => (
                <div key={idx} className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex justify-between">
                  <span><strong className="text-white">{it.quantidade}x</strong> {it.product.nome}</span>
                  <span className="font-bold text-helpusOrange">{formatCurrency(it.precoUnitarioDiaria * it.quantidade * diasLocacao)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totais do Orçamento */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal Equipamentos ({diasLocacao}d):</span>
              <span className="text-white font-bold">{formatCurrency(subtotalLocacao)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Frete ({bairroSelecionado.nome}):</span>
              <span className="text-white font-bold">{formatCurrency(taxaFrete)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-neutral-800">
              <span>Valor Total Estimado:</span>
              <span className="text-helpusOrange text-xl">{formatCurrency(valorTotalEstimado)}</span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setPassoAtual(3)}
              className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl"
            >
              ← Voltar Passo 3
            </button>

            <button
              type="submit"
              disabled={enviando}
              className="py-4 px-8 bg-helpusOrange hover:bg-[#d64a28] text-white font-black text-sm rounded-xl shadow-xl transition transform hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50"
            >
              <span>{enviando ? "Registrando Orçamento..." : "⚡ Registrar Orçamento & Ver Comprovante"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
