import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [imagemAtiva, setImagemAtiva] = useState(product?.imagem || product?.image);

  if (!product) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val || 0);
  };

  const handleToggleOpcao = (opcao) => {
    setOpcoesSelecionadas((prev) => {
      const existe = prev.some((item) => item.id === opcao.id);
      if (existe) {
        return prev.filter((item) => item.id !== opcao.id);
      } else {
        return [...prev, opcao];
      }
    });
  };

  const handleAdicionarAoCarrinho = () => {
    addToCart(product, quantidade, opcoesSelecionadas);
    onClose();
  };

  const galeria = product.galeria || (product.galleryJSON ? JSON.parse(product.galleryJSON) : [product.imagem || product.image]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] text-white">
        {/* Coluna 1: Galeria de Imagens */}
        <div className="md:w-1/2 bg-neutral-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800">
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center relative">
              <img
                src={imagemAtiva || product.imagem}
                alt={product.nome}
                className="w-full h-full object-cover"
              />
              {product.isKit && (
                <span className="absolute top-3 left-3 bg-helpusOrange text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md shadow">
                  🎁 Kit Combo
                </span>
              )}
            </div>

            {/* Miniaturas da Galeria */}
            {galeria && galeria.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {galeria.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImagemAtiva(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      imagemAtiva === img ? "border-helpusOrange scale-105" : "border-neutral-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 text-xs text-neutral-400 border-t border-neutral-800/80">
            <span className="font-mono text-neutral-500 block">SKU do Equipamento:</span>
            <strong className="text-white font-bold">{product.sku || "CAD-TIF-01"}</strong>
          </div>
        </div>

        {/* Coluna 2: Detalhes, Ficha Técnica e Adicionais */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-helpusOrange uppercase tracking-wider">
                  {product.categoria || "Mobiliário"}
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">{product.nome}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Preços */}
            <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">Valor por Diária:</span>
                <span className="text-2xl font-black text-helpusOrange">
                  {formatCurrency(product.precoDiaria || product.priceDaily)}
                </span>
              </div>
              {product.precoSemanal && (
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block font-medium">Pacote Semanal (Economia):</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {formatCurrency(product.precoSemanal)}
                  </span>
                </div>
              )}
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed">{product.descricao}</p>

            {/* Ficha Técnica Detalhada (Dimensões, Material, Peso, Cor) */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                📐 Especificações & Ficha Técnica:
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 block">Dimensões:</span>
                  <span className="font-semibold text-white">{product.dimensoes || "Padrão Corporativo"}</span>
                </div>

                <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 block">Material:</span>
                  <span className="font-semibold text-white">{product.material || "Polipropileno / Aço"}</span>
                </div>

                <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 block">Cor / Acabamento:</span>
                  <span className="font-semibold text-white">{product.cor || "Original"}</span>
                </div>

                <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 block">Carga Suportada:</span>
                  <span className="font-semibold text-white">{product.pesoSuportado || "INMETRO 180kg"}</span>
                </div>
              </div>
            </div>

            {/* Opções e Acessórios Vincualdos */}
            {product.opcoes && product.opcoes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  ➕ Opcionais & Acessórios Sugeridos:
                </h4>
                <div className="space-y-2">
                  {product.opcoes.map((opcao) => {
                    const selecionado = opcoesSelecionadas.some((o) => o.id === opcao.id);
                    return (
                      <label
                        key={opcao.id}
                        onClick={() => handleToggleOpcao(opcao)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          selecionado
                            ? "bg-helpusOrange/15 border-helpusOrange text-white"
                            : "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                        }`}
                      >
                        <span className="font-medium">{opcao.nome}</span>
                        <span className="font-bold text-helpusOrange">
                          + {formatCurrency(opcao.preco)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quantidade e Adicionar ao Carrinho */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-neutral-400 font-medium">Quantidade de Itens:</span>
              <div className="flex items-center border border-neutral-700 rounded-xl overflow-hidden bg-neutral-950">
                <button
                  onClick={() => setQuantidade((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1.5 font-bold text-white text-xs">{quantidade}</span>
                <button
                  onClick={() => setQuantidade((prev) => prev + 1)}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAdicionarAoCarrinho}
              className="w-full py-3.5 px-4 bg-helpusOrange hover:bg-[#d64a28] text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>Adicionar Reserva ao Carrinho</span>
              <span>🛒</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
