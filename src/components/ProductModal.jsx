import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const [quantidade, setQuantidade] = useState(1);
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);

  if (!product) return null;

  const toggleOpcao = (opcao) => {
    setOpcoesSelecionadas((prev) => {
      const exists = prev.some((o) => o.id === opcao.id);
      if (exists) {
        return prev.filter((o) => o.id !== opcao.id);
      } else {
        return [...prev, opcao];
      }
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const precoAdicionais = opcoesSelecionadas.reduce((acc, o) => acc + (o.preco || 0), 0);
  const precoTotalUnitario = (product.precoDiaria || 0) + precoAdicionais;
  const precoTotalItem = precoTotalUnitario * quantidade;

  const handleAddToCart = () => {
    addItem(product, quantidade, opcoesSelecionadas);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-fadeIn">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-neutral-800 text-white rounded-full flex items-center justify-center transition"
          aria-label="Fechar"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2">
          {/* Imagem */}
          <div className="bg-black flex items-center justify-center min-h-[260px] md:min-h-full border-b md:border-b-0 md:border-r border-neutral-800">
            <img
              src={product.imagem}
              alt={product.nome}
              className="w-full h-full object-cover max-h-[380px]"
            />
          </div>

          {/* Detalhes */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-helpusOrange bg-helpusOrange/15 px-2.5 py-1 rounded-md">
                {product.categoria || "Locação"}
              </span>

              <h2 className="text-xl font-bold mt-2">{product.nome}</h2>

              <div className="text-2xl font-extrabold text-white mt-2">
                {formatCurrency(product.precoDiaria)}{" "}
                <span className="text-xs font-normal text-neutral-400">/ diária</span>
              </div>

              <p className="text-neutral-300 text-xs mt-3 leading-relaxed">
                {product.descricao}
              </p>

              {/* Especificações Técnicas */}
              {product.especificacoes && (
                <div className="mt-4 border-t border-neutral-800 pt-3 space-y-1">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase">Especificações:</h4>
                  {Object.entries(product.especificacoes).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs text-neutral-300">
                      <span className="capitalize text-neutral-400">{key}:</span>
                      <span className="font-medium text-white">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Opções Adicionais (Kits/Acessórios) */}
              {product.opcoesAdicionais && product.opcoesAdicionais.length > 0 && (
                <div className="mt-4 border-t border-neutral-800 pt-3 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase">Complementos Opcionais:</h4>
                  {product.opcoesAdicionais.map((op) => {
                    const selected = opcoesSelecionadas.some((o) => o.id === op.id);
                    return (
                      <label
                        key={op.id}
                        onClick={() => toggleOpcao(op)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                          selected
                            ? "border-helpusOrange bg-helpusOrange/10 text-white"
                            : "border-neutral-800 bg-neutral-950/50 text-neutral-300 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {}}
                            className="accent-helpusOrange"
                          />
                          <span>{op.nome}</span>
                        </div>
                        <span className="font-semibold text-helpusOrange">
                          +{formatCurrency(op.preco)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Controle de Quantidade & Adicionar ao Orçamento */}
            <div className="border-t border-neutral-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Quantidade:</span>
                <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-950">
                  <button
                    onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-neutral-300 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold">{quantidade}</span>
                  <button
                    onClick={() => setQuantidade((q) => q + 1)}
                    className="px-3 py-1 text-neutral-300 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Total calculado:</span>
                <span className="text-lg font-bold text-helpusOrange">
                  {formatCurrency(precoTotalItem)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 rounded-xl bg-helpusOrange hover:bg-[#d64a28] text-white font-semibold text-sm shadow-lg transition-transform hover:scale-[1.01]"
              >
                Adicionar ao Orçamento 🛒
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
