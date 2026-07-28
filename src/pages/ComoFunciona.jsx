import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ComoFunciona() {
  const [faqAberta, setFaqAberta] = useState(null);

  const faqs = [
    {
      pergunta: "Qual é o prazo mínimo para solicitar uma reserva de equipamentos?",
      resposta: "Recomendamos solicitar com pelo menos 48 horas de antecedência para garantir a disponibilidade do acervo e a rota logística em João Pessoa e região. Para eventos de grande porte ou casamentos, sugerimos reservar com 15 a 30 dias de antecedência."
    },
    {
      pergunta: "Como funciona a entrega, montagem e desmontagem das tendas e mobília?",
      resposta: "Nossa equipe logística cuida de todo o processo! Entregamos, montamos as estruturas (como tendas piramidais, pistas de dança e climatizadores) e organizamos o mobiliário no local indicado. Após o evento, realizamos a desmontagem e o recolhimento."
    },
    {
      pergunta: "Quais bairros e cidades da Paraíba a Plural Locações atende?",
      resposta: "Atendemos 100% dos bairros de João Pessoa (Tambaú, Cabo Branco, Manaíra, Altiplano, Bessa, Bancários, Miramar, Intermares, etc.), além de Cabedelo, Conde, Bayeux e Santa Rita."
    },
    {
      pergunta: "Quais são as formas de pagamento aceitas?",
      resposta: "Aceitamos PIX (com sinal de 30% para garantia de data e reserva no sistema), Cartão de Crédito em até 12x e Faturamento Corporativo via Boleto para empresas cadastradas."
    },
    {
      pergunta: "Como funciona caso ocorra quebra ou avaria de algum item alugado?",
      resposta: "Durante o recolhimento, nossa equipe realiza a Vistoria de Retorno. Caso haja avaria ou perda, é cobrado o valor de reposição especificado na ficha técnica e no contrato de locação de forma simples e transparente."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Header Como Funciona */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-widest text-helpusOrange">
          Transparência & Pontualidade
        </span>
        <h1 className="text-4xl font-black text-white">Como Funciona a Locação na Plural</h1>
        <p className="text-neutral-400 text-sm">
          Conheça o passo a passo simplificado desde a escolha dos equipamentos até a montagem e devolução no seu evento.
        </p>
      </div>

      {/* Grid de 4 Passos Visuais */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3 relative hover:border-helpusOrange/50 transition group shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-helpusOrange/15 text-helpusOrange font-black text-xl flex items-center justify-center border border-helpusOrange/30 group-hover:scale-110 transition">
            1
          </div>
          <h3 className="font-bold text-white text-base">Monte sua Cotação</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Escolha os equipamentos no catálogo online, selecione o período do evento e seu bairro em João Pessoa para cálculo automático do frete.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3 relative hover:border-helpusOrange/50 transition group shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-helpusOrange/15 text-helpusOrange font-black text-xl flex items-center justify-center border border-helpusOrange/30 group-hover:scale-110 transition">
            2
          </div>
          <h3 className="font-bold text-white text-base">Reserva Garantida</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Receba o Orçamento e Contrato PDF oficial. A reserva é confirmada com o pagamento do sinal de 30% via PIX.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3 relative hover:border-helpusOrange/50 transition group shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-helpusOrange/15 text-helpusOrange font-black text-xl flex items-center justify-center border border-helpusOrange/30 group-hover:scale-110 transition">
            3
          </div>
          <h3 className="font-bold text-white text-base">Entrega & Montagem</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Nossa equipe logística entrega os materiais limpos, realiza a montagem de tendas, pistas e climatizadores no horário agendado.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3 relative hover:border-helpusOrange/50 transition group shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-helpusOrange/15 text-helpusOrange font-black text-xl flex items-center justify-center border border-helpusOrange/30 group-hover:scale-110 transition">
            4
          </div>
          <h3 className="font-bold text-white text-base">Desmontagem & Vistoria</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Após o término do evento, recolhemos os equipamentos no horário acordado e realizamos a vistoria de retorno simplificada.
          </p>
        </div>
      </div>

      {/* Banner de Ação Directa */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl font-black text-white">Pronto para Planejar seu Evento?</h2>
          <p className="text-neutral-400 text-xs">
            Explore mais de 28 equipamentos corporativos, tendas, mesas e climatizadores com valores transparentes.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/catalogo"
            className="py-3 px-6 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow-lg transition transform hover:scale-[1.02]"
          >
            Explorar Catálogo de Equipamentos 📦
          </Link>
          <a
            href="https://wa.me/5583999087188?text=Ola%2C%20gostaria%20de%20tirar%20uma%20duvida%20sobre%20a%20locacao."
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-6 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl border border-neutral-700 transition"
          >
            Falar no WhatsApp 💬
          </a>
        </div>
      </div>

      {/* FAQ Sanfonada Interativa */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white">Dúvidas Frequentes (FAQ)</h2>
          <p className="text-neutral-400 text-xs">Respostas rápidas para as principais dúvidas de nossos clientes.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition shadow-md"
            >
              <button
                onClick={() => setFaqAberta(faqAberta === idx ? null : idx)}
                className="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-white hover:text-helpusOrange transition"
              >
                <span>{faq.pergunta}</span>
                <span className="text-sm font-mono text-neutral-500">
                  {faqAberta === idx ? "−" : "+"}
                </span>
              </button>
              {faqAberta === idx && (
                <div className="px-4 pb-4 text-xs text-neutral-400 border-t border-neutral-800/60 pt-3 leading-relaxed">
                  {faq.resposta}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
