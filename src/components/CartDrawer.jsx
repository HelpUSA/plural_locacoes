import React from "react";
import { useCart, BAIRROS_FRETE } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
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
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();

  if (!isCartOpen) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl">
          {/* Header Drawer */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <h2 className="text-lg font-bold text-white">Carrinho de Orçamento</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
              aria-label="Fechar carrinho"
            >
              ✕
            </button>
          </div>

          {/* Seletor de Período & Datas */}
          <div className="bg-neutral-950/60 p-4 border-b border-neutral-800 text-xs space-y-3">
            <div className="font-semibold text-helpusOrange uppercase tracking-wider flex items-center justify-between">
              <span>📅 Período do Evento</span>
              <span className="bg-helpusOrange/15 text-helpusOrange px-2 py-0.5 rounded font-bold">
                {diasLocacao} {diasLocacao === 1 ? "diária" : "diárias"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">Data Entrega:</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-helpusOrange"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Data Devolução:</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-helpusOrange"
                />
              </div>
            </div>
          </div>

          {/* Lista de Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-4xl opacity-40">📦</div>
                <p className="text-neutral-400 text-sm">Seu carrinho de orçamento está vazio.</p>
                <button
                  onClick={closeCart}
                  className="inline-block text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-full font-medium transition"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.itemKey}
                  className="flex gap-3 bg-neutral-950/80 border border-neutral-800/80 p-3 rounded-xl relative"
                >
                  <img
                    src={item.product.imagem}
                    alt={item.product.nome}
                    className="w-16 h-16 object-cover rounded-lg border border-neutral-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {item.product.nome}
                    </h4>

                    {item.opcoesSelecionadas.length > 0 && (
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {item.opcoesSelecionadas.map((op) => (
                          <span key={op.id} className="block text-[11px] text-neutral-400">
                            + {op.nome} ({formatCurrency(op.preco)})
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-helpusOrange font-medium mt-1">
                      {formatCurrency(item.precoUnitarioDiaria)} / diária
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-700 rounded bg-neutral-900">
                        <button
                          onClick={() => updateQuantity(item.itemKey, item.quantidade - 1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantidade}</span>
                        <button
                          onClick={() => updateQuantity(item.itemKey, item.quantidade + 1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.itemKey)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer do Carrinho com Totais e Botão de Finalizar */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-950 space-y-4">
              {/* Seletor de Frete */}
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  🚚 Bairro de Entrega (Estimativa de Frete):
                </label>
                <select
                  value={bairroSelecionado.nome}
                  onChange={(e) => {
                    const b = BAIRROS_FRETE.find((item) => item.nome === e.target.value);
                    if (b) setBairroSelecionado(b);
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-helpusOrange"
                >
                  {BAIRROS_FRETE.map((b) => (
                    <option key={b.nome} value={b.nome}>
                      {b.nome} ({formatCurrency(b.taxa)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Resumo de Preços */}
              <div className="space-y-1.5 text-xs text-neutral-300 border-t border-neutral-800/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal itens ({diasLocacao} {diasLocacao === 1 ? 'diária' : 'diárias'}):</span>
                  <span className="font-semibold text-white">{formatCurrency(subtotalLocacao)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete / Entrega estimada:</span>
                  <span className="font-semibold text-white">{formatCurrency(taxaFrete)}</span>
                </div>
                <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-neutral-800">
                  <span>Total Estimado:</span>
                  <span className="text-helpusOrange">{formatCurrency(valorTotalEstimado)}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-2 pt-1">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl bg-helpusOrange hover:bg-[#d64a28] text-white font-semibold text-sm shadow-lg transition-transform hover:scale-[1.01]"
                >
                  Finalizar Orçamento via WhatsApp 📲
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 py-1"
                >
                  Esvaziar carrinho
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
