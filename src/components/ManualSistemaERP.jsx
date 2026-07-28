import React, { useState } from "react";

export default function ManualSistemaERP() {
  const [busca, setBusca] = useState("");
  const [moduloAtivo, setModuloAtivo] = useState("roteiro");

  const modulosManual = [
    {
      id: "roteiro",
      icone: "🚀",
      titulo: "Roteiro de Trabalho do Dia a Dia (Workflow)",
      descricao: "Guia prático para a rotina diária dos funcionários e atendentes da Plural Locações.",
      passos: [
        "1. Checagem Diária do Painel (Aba Romaneio): Abra a aba '🚚 Romaneio & Documentos' para ver novos orçamentos iniciados pelo site.",
        "2. Conferência do Sinal PIX (30%): Verifique se o cliente efetuou o pagamento do sinal de 30% conforme o QR Code gerado no orçamento.",
        "3. Alteração do Status para 'Aprovado': Mude o status do pedido para 'APPROVED' (Orçamento Aprovado com Sinal).",
        "4. Emissão do Contrato A4: Clique no botão '📜 Contrato A4' para imprimir o termo de responsabilidade que deve ser assinado na entrega.",
        "5. Despacho Logístico: Libere a equipe de transporte verificando a rota e taxa do bairro de João Pessoa selecionado.",
        "6. Recolhimento & Vistoria: Ao recolher os materiais, clique em '🔍 Vistoria' e registre se houve alguma avaria ou quebra.",
        "7. Fechamento do Pedido: Mude o status para 'COMPLETED' (Concluído) e lance despesas de transporte na aba '💰 Financeiro'."
      ]
    },
    {
      id: "catalogo",
      icone: "📦",
      titulo: "Módulo 1: Catálogo & Gestão de Estoque",
      descricao: "Como cadastrar, alterar preços de diárias, atualizar fotos HD e controlar o estoque de equipamentos.",
      passos: [
        "Para Cadastrar Novo Produto: Clique no botão '+ Novo Produto', insira Nome, SKU único (ex: CAD-TIF-01), Categoria, Valor da Diária, Foto HD e Estoque.",
        "Para Editar Produto Existente: Clique em '✏️ Editar' no card do equipamento desejado na aba '📦 Catálogo'.",
        "Para Alterar Fotos ou Especificações: Abra a edição e cole a nova URL da imagem ou ajuste as dimensões e peso suportado.",
        "Para Pausar Locação de um Item: Altere o status do produto de 'ACTIVE' para 'INACTIVE' ou bloqueie a peça na aba 'Manutenção'."
      ]
    },
    {
      id: "romaneio",
      icone: "🚚",
      titulo: "Módulo 2: Romaneio, Pedidos & Emissão de PDFs",
      descricao: "Como gerenciar reservas, atualizar etapas de entrega e emitir Orçamentos, Contratos A4 e Recibos em PDF.",
      passos: [
        "Gerar Orçamento PDF Comercial: Clique no botão '📄 Orçamento PDF' ao lado do pedido. Uma página formatada com QR Code PIX será gerada para envio ao cliente.",
        "Gerar Contrato de Locação A4: Clique em '📜 Contrato A4' para emitir o termo jurídico com os dados do cliente, itens, período e regras de avaria.",
        "Gerar Recibo de Quitação: Clique em '🧾 Recibo' para emitir o comprovante financeiro oficial.",
        "Mudar Status da Locação: Altere o seletor de status no pedido entre 'PENDING' (Solicitação), 'APPROVED' (Aprovado com Sinal), 'OUT_FOR_DELIVERY' (Saiu para Entrega), 'DELIVERED' (Entregue) e 'COMPLETED' (Concluído)."
      ]
    },
    {
      id: "financeiro",
      icone: "💰",
      titulo: "Módulo 3: Controle Financeiro & DRE",
      descricao: "Como acompanhar Faturamento Bruto, registrar custos operacionais e visualizar o Lucro Líquido.",
      passos: [
        "Faturamento Bruto: Calculado automaticamente com base na soma de todos os pedidos finalizados e aprovados.",
        "Lançamento de Despesas: Clique em '+ Nova Despesa', digite a descrição (ex: Combustível, Manutenção Tenda), valor e categoria.",
        "DRE Simplificado: Acompanhe em tempo real o Faturamento (-) Despesas = Lucro Líquido do mês."
      ]
    },
    {
      id: "relatorios",
      icone: "📊",
      titulo: "Módulo 4: Relatórios BI & Desempenho",
      descricao: "Como analisar o ranking dos equipamentos mais rentáveis e a receita por bairro de João Pessoa.",
      passos: [
        "Ranking de Produtos: Identifique quais itens têm maior taxa de ocupação (ex: Cadeira Tiffany vs Mesas Redondas).",
        "Faturamento por Bairro: Veja a distribuição de receita entre os bairros (Tambaú, Cabo Branco, Altiplano, Bessa, etc.) para otimizar rotas de frete."
      ]
    },
    {
      id: "manutencao",
      icone: "👨‍🔧",
      titulo: "Módulo 5: Manutenção & Avarias",
      descricao: "Como registrar quebras de equipamentos na devolução e acompanhar custos de fornecedores.",
      passos: [
        "Lançar Item Quebrado/Danificado: Na aba 'Manutenção', clique em '+ Bloquear para Reparo', selecione o item, o motivo (ex: pé de cadeira quebrado) e o custo estimado de reparo.",
        "Controle de Fornecedores: Cadastre oficinas de marcenaria ou fornecedores de peças de reposição."
      ]
    },
    {
      id: "usuarios",
      icone: "👥",
      titulo: "Módulo 6: Gestão de Usuários & Níveis de Acesso",
      descricao: "Como cadastrar funcionários, alterar papéis corporativos (RBAC) e redefinir senhas.",
      passos: [
        "Níveis de Acesso (Roles): DEVELOPER (SuperAdmin Total), STORE_OWNER (Gerente/Dono), OPERATOR (Funcionário Atendente/Logística), CLIENT (Cliente Final).",
        "Editar Usuário: Clique no botão '✏️ Editar Dados' ao lado do usuário na lista para atualizar Nome, E-mail, Telefone/WhatsApp, Nível de Acesso ou Senha."
      ]
    },
    {
      id: "configs",
      icone: "⚙️",
      titulo: "Módulo 7: Configurações da Empresa",
      descricao: "Como atualizar a Chave PIX oficial, WhatsApp comercial e Termos de Contrato.",
      passos: [
        "Atualizar Chave PIX: Altere a chave PIX exibida em todos os orçamentos e comprovantes dos clientes.",
        "Termos do Contrato: Personalize a cláusula de avarias e regras de cancelamento registradas nos Contratos A4."
      ]
    }
  ];

  const modulosFiltrados = modulosManual.filter((m) => {
    const q = busca.toLowerCase();
    return (
      m.titulo.toLowerCase().includes(q) ||
      m.descricao.toLowerCase().includes(q) ||
      m.passos.some((p) => p.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header do Manual */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-black text-helpusOrange uppercase tracking-widest">
              Treinamento & Guia do Operador ERP
            </span>
            <h2 className="text-3xl font-black text-white mt-1">Manual Oficial do Sistema Plural Locações</h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Roteiro passo a passo e procedimentos padrão para proprietários, gerentes e funcionários operarem a loja e o ERP com 100% de eficiência.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="🔍 Pesquisar no manual (ex: PIX, contrato, despesa)..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-helpusOrange"
            />
          </div>
        </div>

        {/* Seleção de Módulo Rápido */}
        <div className="flex flex-wrap gap-2 pt-2">
          {modulosManual.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setModuloAtivo(mod.id)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 cursor-pointer ${
                moduloAtivo === mod.id
                  ? "bg-helpusOrange text-white border-helpusOrange shadow-lg"
                  : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <span>{mod.icone}</span>
              <span>{mod.titulo.split(":")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo dos Módulos */}
      <div className="space-y-6">
        {modulosFiltrados.map((mod) => (
          <div
            key={mod.id}
            id={`mod-${mod.id}`}
            className={`bg-neutral-900 border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl transition ${
              moduloAtivo === mod.id ? "border-helpusOrange ring-1 ring-helpusOrange/40" : "border-neutral-800"
            }`}
          >
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-helpusOrange/15 text-helpusOrange font-black text-2xl flex items-center justify-center border border-helpusOrange/30">
                {mod.icone}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{mod.titulo}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{mod.descricao}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-black text-helpusOrange uppercase tracking-wider">
                Procedimento Passo a Passo:
              </div>
              <div className="space-y-2">
                {mod.passos.map((p, idx) => {
                  const parts = p.split(":");
                  return (
                    <div
                      key={idx}
                      className="bg-neutral-950 border border-neutral-800/80 p-3.5 rounded-2xl text-xs text-neutral-300 leading-relaxed flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-lg bg-neutral-900 text-helpusOrange font-bold text-xs flex items-center justify-center border border-neutral-800 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        {parts.length > 1 ? (
                          <>
                            <strong className="text-white">{parts[0]}:</strong>
                            <span>{parts.slice(1).join(":")}</span>
                          </>
                        ) : (
                          <span>{p}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
