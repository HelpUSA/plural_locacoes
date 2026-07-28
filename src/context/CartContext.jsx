import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const BAIRROS_FRETE = [
  { nome: "Tambaú / Cabo Branco / Manaíra", taxa: 120.0 },
  { nome: "Bessa / Intermares", taxa: 140.0 },
  { nome: "Altiplano / Portal do Sol", taxa: 130.0 },
  { nome: "Bessa / Camboinha / Poço (Cabedelo)", taxa: 180.0 },
  { nome: "Bayeux / Santa Rita / Tibiri", taxa: 220.0 },
  { nome: "Outros bairros (A combinar)", taxa: 150.0 }
];

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("plural_cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar carrinho salvo:", e);
      }
    }
    return [];
  });

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const getDayAfterStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  };

  const [dataInicio, setDataInicio] = useState(getTomorrowStr);
  const [dataFim, setDataFim] = useState(getDayAfterStr);
  const [bairroSelecionado, setBairroSelecionado] = useState(BAIRROS_FRETE[0]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("plural_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const diasLocacao = useMemo(() => {
    if (!dataInicio || !dataFim) return 1;
    const start = new Date(dataInicio);
    const end = new Date(dataFim);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [dataInicio, dataFim]);

  const addItem = (product, quantidade = 1, opcoesSelecionadas = []) => {
    if (!product) return;
    setCartItems((prev) => {
      const pId = product.id || `p-${Date.now()}`;
      const itemKey = `${pId}-${opcoesSelecionadas.map(o => o.id).sort().join(",")}`;
      const existingIndex = prev.findIndex(item => item.itemKey === itemKey);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantidade += quantidade;
        return updated;
      }

      const precoAdicionais = opcoesSelecionadas.reduce((acc, op) => acc + (op.preco || 0), 0);
      const precoUnitarioDiaria = (product.precoDiaria || product.priceDaily || 0) + precoAdicionais;

      return [
        ...prev,
        {
          itemKey,
          product: {
            id: pId,
            nome: product.nome || product.name || "Equipamento Corporativo",
            sku: product.sku || "SKU-001",
            imagem: product.imagem || product.image || "/mesas-e-cadeiras-01.jpeg",
            precoDiaria: product.precoDiaria || product.priceDaily || 0
          },
          quantidade,
          opcoesSelecionadas,
          precoUnitarioDiaria
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeItem = (itemKey) => {
    setCartItems((prev) => prev.filter((item) => item.itemKey !== itemKey));
  };

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.itemKey === itemKey ? { ...item, quantidade: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItensCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantidade, 0);
  }, [cartItems]);

  const subtotalDiario = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.precoUnitarioDiaria * item.quantidade, 0);
  }, [cartItems]);

  const subtotalLocacao = useMemo(() => {
    return subtotalDiario * diasLocacao;
  }, [subtotalDiario, diasLocacao]);

  const taxaFrete = bairroSelecionado ? bairroSelecionado.taxa : 0;
  const valorTotalEstimado = subtotalLocacao + taxaFrete;

  const saveOrderToDB = async (orderPayload, token) => {
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const order = await res.json();
        return order;
      }
    } catch (e) {
      console.warn("Backend API indisponível, salvando histórico localmente:", e);
    }

    // Salvar localmente
    const existing = JSON.parse(localStorage.getItem("plural_orders_history") || "[]");
    const newOrder = {
      id: `ord-${Date.now()}`,
      status: "PENDING",
      ...orderPayload,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("plural_orders_history", JSON.stringify([newOrder, ...existing]));
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,
        diasLocacao,
        bairroSelecionado,
        setBairroSelecionado,
        taxaFrete,
        subtotalDiario,
        subtotalLocacao,
        valorTotalEstimado,
        totalItensCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        addItem,
        addToCart: addItem, // ALIAS FOR UNBROKEN COMPATIBILITY
        removeItem,
        updateQuantity,
        clearCart,
        saveOrderToDB
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
