import React, { useState } from "react";
import { BAIRROS_FRETE, useCart } from "../context/CartContext.jsx";

export default function SimuladorFrete() {
  const { setBairroSelecionado, bairroSelecionado } = useCart();
  const [bairroTemp, setBairroTemp] = useState(bairroSelecionado.nome);
  const [mensagemCalculado, setMensagemCalculado] = useState("");

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const handleSimular = (e) => {
    e.preventDefault();
    const b = BAIRROS_FRETE.find((item) => item.nome === bairroTemp);
    if (b) {
      setBairroSelecionado(b);
      setMensagemCalculado(`Frete estimado para ${b.nome}: ${formatCurrency(b.taxa)}`);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🚚</span>
        <div>
          <h3 className="font-bold text-lg text-white">Simulador de Frete e Entrega</h3>
          <p className="text-xs text-neutral-400">
            Confira a estimativa de taxa de entrega para João Pessoa e região metropolitana.
          </p>
        </div>
      </div>

      <form onSubmit={handleSimular} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Selecione o Bairro / Região do Evento:
          </label>
          <select
            value={bairroTemp}
            onChange={(e) => setBairroTemp(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-helpusOrange"
          >
            {BAIRROS_FRETE.map((b) => (
              <option key={b.nome} value={b.nome}>
                {b.nome} — {formatCurrency(b.taxa)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl transition"
        >
          Calcular Taxa de Entrega
        </button>
      </form>

      {mensagemCalculado && (
        <div className="mt-4 p-3 bg-helpusOrange/10 border border-helpusOrange/30 text-helpusOrange text-xs font-medium rounded-xl flex items-center justify-between">
          <span>{mensagemCalculado}</span>
          <span className="text-base">✓</span>
        </div>
      )}
    </div>
  );
}
