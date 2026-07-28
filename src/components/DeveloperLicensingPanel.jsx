import React, { useState, useEffect } from "react";

export default function DeveloperLicensingPanel({ orders = [], companySettings = {}, onUpdateSettings }) {
  const [statusLicenca, setStatusLicenca] = useState(companySettings.licenseStatus || "ACTIVE");
  const [dataExpiracao, setDataExpiracao] = useState(companySettings.licenseExpirationDate || "2026-12-31");
  const [taxaComissao, setTaxaComissao] = useState(companySettings.developerCommissionRate || "3.0");
  const [limiteTrial, setLimiteTrial] = useState(companySettings.trialMonthlyOrderLimit || "10");
  const [marcaDaguaAtiva, setMarcaDaguaAtiva] = useState(companySettings.watermarkEnabled !== "false");

  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (companySettings.licenseStatus) setStatusLicenca(companySettings.licenseStatus);
    if (companySettings.licenseExpirationDate) setDataExpiracao(companySettings.licenseExpirationDate);
    if (companySettings.developerCommissionRate) setTaxaComissao(companySettings.developerCommissionRate);
    if (companySettings.trialMonthlyOrderLimit) setLimiteTrial(companySettings.trialMonthlyOrderLimit);
    if (companySettings.watermarkEnabled !== undefined) setMarcaDaguaAtiva(companySettings.watermarkEnabled === "true");
  }, [companySettings]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  // Cálculo financeiro da plataforma e comissão do desenvolvedor
  const faturamentoTotal = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((acc, o) => acc + (o.totalPrice || o.subtotal || 0), 0);

  const percentual = parseFloat(taxaComissao) || 0;
  const comissaoDesenvolvedor = (faturamentoTotal * percentual) / 100;
  const faturamentoProprietario = faturamentoTotal - comissaoDesenvolvedor;

  const temSolicitacaoPendente = companySettings.licenseRequested === "true";

  const handleSalvarLicenciamento = async (e) => {
    e.preventDefault();
    setSalvando(true);

    const novasConfigs = {
      licenseStatus: statusLicenca,
      licenseExpirationDate: dataExpiracao,
      developerCommissionRate: String(taxaComissao),
      trialMonthlyOrderLimit: String(limiteTrial),
      watermarkEnabled: String(marcaDaguaAtiva),
      licenseRequested: "false" // Reseta a solicitacao apos salvar
    };

    try {
      await onUpdateSettings(novasConfigs);
      alert("Configurações de Licenciamento & Parceria salvas com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar licenciamento:", err);
      alert("Falha ao atualizar configurações de licenciamento.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Alerta de Solicitação Pendente enviada pelo Gerente */}
      {temSolicitacaoPendente && (
        <div className="bg-amber-500 text-black p-5 rounded-3xl font-bold flex flex-wrap items-center justify-between gap-4 shadow-xl border-2 border-amber-400">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔔</span>
            <div>
              <h4 className="text-base font-black uppercase">Solicitação de Liberação da Versão Completa Recebida!</h4>
              <p className="text-xs font-semibold text-neutral-900 mt-0.5">
                O gerente/proprietário da Plural Locações solicitou a ativação ilimitada do sistema. Altere o status abaixo para "🟢 Licença Ativa".
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusLicenca("ACTIVE")}
            className="py-2 px-5 bg-black text-white font-black text-xs rounded-xl hover:bg-neutral-800 transition"
          >
            Aprovar & Ativar Agora
          </button>
        </div>
      )}

      {/* Header do Desenvolvedor */}
      <div className="bg-neutral-900 border border-helpusOrange/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-helpusOrange text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Exclusivo Desenvolvedor (SuperAdmin)
              </span>
              <span className="text-xs text-neutral-400 font-mono">Gestão de Licenças & Comissão</span>
            </div>
            <h2 className="text-3xl font-black text-white mt-1">Painel do Desenvolvedor & Parceria</h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Acompanhamento do faturamento do site, cálculo da comissão percentual e controle do status de ativação/renovação do sistema.
            </p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-right">
            <span className="text-xs text-neutral-400 block font-bold">Status Atual do Sistema:</span>
            {statusLicenca === "ACTIVE" && (
              <span className="text-emerald-400 font-black text-sm flex items-center gap-1 justify-end">
                🟢 Licença Ativa (Versão Completa)
              </span>
            )}
            {statusLicenca === "TRIAL" && (
              <span className="text-amber-400 font-black text-sm flex items-center gap-1 justify-end">
                🟡 Licença Degustação (Trial)
              </span>
            )}
            {statusLicenca === "EXPIRED" && (
              <span className="text-red-400 font-black text-sm flex items-center gap-1 justify-end">
                🔴 Licença Suspensa / Expirada
              </span>
            )}
          </div>
        </div>

        {/* Métrica da Parceria e Comissão */}
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block">
              Faturamento Total da Loja
            </span>
            <div className="text-2xl font-black text-white">
              {formatCurrency(faturamentoTotal)}
            </div>
            <span className="text-[10px] text-neutral-500 block">Soma de todos os orçamentos não cancelados</span>
          </div>

          <div className="bg-neutral-950 p-5 rounded-2xl border border-helpusOrange/50 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-helpusOrange font-extrabold uppercase tracking-wider block">
                Comissão do Desenvolvedor
              </span>
              <span className="text-xs font-mono font-bold text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded">
                {taxaComissao}%
              </span>
            </div>
            <div className="text-2xl font-black text-helpusOrange">
              {formatCurrency(comissaoDesenvolvedor)}
            </div>
            <span className="text-[10px] text-neutral-400 block">Sua fatia da parceria pelas vendas no site</span>
          </div>

          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block">
              Repasse Líquido Proprietário
            </span>
            <div className="text-2xl font-black text-emerald-400">
              {formatCurrency(faturamentoProprietario)}
            </div>
            <span className="text-[10px] text-neutral-500 block">Valor retido pela operação da empresa</span>
          </div>
        </div>
      </div>

      {/* Formulário de Gerenciamento da Licença & Regras de Ativação */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-neutral-800 pb-3">
          <h3 className="text-xl font-bold text-white">⚙️ Configurações de Licença & Renovação</h3>
          <p className="text-neutral-400 text-xs mt-0.5">
            Defina o status do sistema, data limite de renovação e alíquota da comissão.
          </p>
        </div>

        <form onSubmit={handleSalvarLicenciamento} className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5">Status de Ativação do Sistema *</label>
              <select
                value={statusLicenca}
                onChange={(e) => setStatusLicenca(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 font-bold text-xs"
              >
                <option value="ACTIVE">🟢 Licença Ativa (Versão Completa Sem Limites)</option>
                <option value="TRIAL">🟡 Licença Degustação (Trial Com Marca d'Água)</option>
                <option value="EXPIRED">🔴 Licença Suspensa / Pendente de Renovação</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1.5">Data Limite de Renovação *</label>
              <input
                type="date"
                required
                value={dataExpiracao}
                onChange={(e) => setDataExpiracao(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 font-bold text-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1.5">Percentual de Comissão (% Parceria) *</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  required
                  value={taxaComissao}
                  onChange={(e) => setTaxaComissao(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 font-bold text-xs pr-8"
                />
                <span className="absolute right-3 top-3 text-neutral-400 font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1.5">Limite de Pedidos Mensais no Trial</label>
              <input
                type="number"
                min="1"
                value={limiteTrial}
                onChange={(e) => setLimiteTrial(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 text-xs"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 bg-neutral-950 p-3 rounded-2xl border border-neutral-800 mt-auto">
              <input
                type="checkbox"
                id="chkWatermark"
                checked={marcaDaguaAtiva}
                onChange={(e) => setMarcaDaguaAtiva(e.target.checked)}
                className="w-4 h-4 accent-helpusOrange rounded"
              />
              <label htmlFor="chkWatermark" className="text-neutral-300 font-semibold cursor-pointer">
                Exibir Marca d'Água <span className="text-helpusOrange font-bold font-mono text-[11px]">"DEMONSTRAÇÃO / LICENÇA PENDENTE"</span> nos PDFs quando estiver em Trial ou Expirado.
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={salvando}
              className="py-3 px-8 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              {salvando ? "Salvando..." : "💾 Salvar Configurações de Licença"}
            </button>
          </div>
        </form>
      </div>

      {/* Tabela de Vendas & Comissão Detalhada Item a Item */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h3 className="text-lg font-bold text-white">📊 Extrato de Vendas & Comissão do Desenvolvedor</h3>
          <span className="text-xs text-neutral-400 font-mono">Taxa Aplicada: {taxaComissao}%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
              <tr>
                <th className="p-3">Pedido</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Data</th>
                <th className="p-3">Total do Pedido</th>
                <th className="p-3 text-right">Comissão Dev ({taxaComissao}%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-neutral-500 font-sans">
                    Nenhum pedido registrado para cálculo de comissão.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const valorTotal = o.totalPrice || o.subtotal || 0;
                  const comissaoItem = (valorTotal * percentual) / 100;
                  return (
                    <tr key={o.id} className="hover:bg-neutral-950/40">
                      <td className="p-3 font-bold text-helpusOrange">
                        {o.orderNumber || `#${o.id.slice(0, 8)}`}
                      </td>
                      <td className="p-3 font-sans text-white">{o.clientName}</td>
                      <td className="p-3 text-neutral-400">
                        {new Date(o.createdAt || Date.now()).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3 font-bold text-white">
                        {formatCurrency(valorTotal)}
                      </td>
                      <td className="p-3 font-bold text-right text-emerald-400">
                        {formatCurrency(comissaoItem)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
