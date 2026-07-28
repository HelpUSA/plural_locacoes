import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

const INITIAL_PRODUCTS = [
  {
    id: "p1",
    sku: "MES-RED-120-01",
    nome: "Mesa Redonda 1,20m em MDF Nobre",
    categoria: "Mesas & Bancadas",
    categoriaName: "Mesas & Bancadas",
    departamento: "mobiliario-lounges",
    precoDiaria: 40.0,
    precoSemanal: 180.0,
    imagem: "/mesas-e-cadeiras-01.jpeg",
    galeria: ["/mesas-e-cadeiras-01.jpeg", "/imagem01.jpg"],
    descricao: "Mesa redonda em MDF resistente de 15mm com bordas seladas e pés metálicos com travamento de segurança. Acomoda confortavelmente 8 lugares.",
    cor: "Madeira Natural / Pés Pretos",
    material: "MDF Nobre com Estrutura de Aço Carbono",
    dimensoes: "1,20m (Diâmetro) x 75cm (Altura)",
    pesoSuportado: "Até 100 kg distribuídos",
    especificacoes: {
      "Capacidade": "8 Pessoas Sentadas",
      "Travamento": "Pés Dobráveis de Pressão"
    },
    opcoes: [
      { id: "o1", nome: "Toalha Branca em Oxford (até o chão)", preco: 30.0 }
    ],
    estoque: 40,
    status: "ACTIVE",
    destaque: "🔥 Campeã de locações para casamentos e banquetes"
  }
];

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("plural_products_catalog");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  const [loading, setLoading] = useState(false);

  const fetchProductsFromAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map(p => ({
          id: p.id,
          sku: p.sku || `SKU-${p.id.slice(0, 6)}`,
          nome: p.name,
          categoriaName: p.category?.name || p.categoryName || p.category?.slug || "Geral",
          categoria: p.category?.name || p.categoryName || p.category?.slug || "Geral",
          departamento: p.department?.slug || p.departmentId || "mobiliario-lounges",
          precoDiaria: p.priceDaily,
          precoSemanal: p.priceWeekly || p.priceDaily * 4.5,
          imagem: p.image || "/mesas-e-cadeiras-01.jpeg",
          galeria: p.galleryJSON ? JSON.parse(p.galleryJSON) : [p.image],
          descricao: p.description,
          cor: p.color || "Personalizado",
          material: p.material || "Reforçado",
          dimensoes: p.dimensions || "Sob consulta",
          pesoSuportado: p.maxWeight || "Padrão corporativo",
          especificacoes: p.specsJSON ? (typeof p.specsJSON === "string" ? JSON.parse(p.specsJSON) : p.specsJSON) : {},
          opcoes: p.addons ? p.addons.map(a => ({ id: a.id, nome: a.name, preco: a.price })) : [],
          estoque: p.stock || 50,
          status: p.status || "ACTIVE",
          isKit: !!p.isKit,
          destaque: p.highlight || ""
        }));
        setProducts(formatted);
        localStorage.setItem("plural_products_catalog", JSON.stringify(formatted));
      }
    } catch (e) {
      console.warn("Usando catálogo local offline:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsFromAPI();
  }, []);

  const addProduct = (newProd) => {
    const created = {
      id: `p-${Date.now()}`,
      sku: newProd.sku || `SKU-${Date.now()}`,
      nome: newProd.nome,
      categoria: newProd.categoria,
      categoriaName: newProd.categoria,
      departamento: newProd.departamento || "mobiliario-lounges",
      precoDiaria: parseFloat(newProd.precoDiaria) || 0,
      precoSemanal: parseFloat(newProd.precoSemanal) || 0,
      imagem: newProd.imagem || "/mesas-e-cadeiras-01.jpeg",
      galeria: [newProd.imagem || "/mesas-e-cadeiras-01.jpeg"],
      descricao: newProd.descricao || "",
      cor: newProd.cor || "Padrão",
      material: newProd.material || "Reforçado",
      dimensoes: newProd.dimensoes || "Padrão",
      pesoSuportado: newProd.pesoSuportado || "Padrão",
      especificacoes: {},
      opcoes: [],
      estoque: parseInt(newProd.estoque, 10) || 50,
      status: "ACTIVE",
      destaque: newProd.destaque || ""
    };

    setProducts(prev => {
      const updated = [created, ...prev];
      localStorage.setItem("plural_products_catalog", JSON.stringify(updated));
      return updated;
    });
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
      localStorage.setItem("plural_products_catalog", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProduct = (id) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem("plural_products_catalog", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: fetchProductsFromAPI
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts deve ser usado dentro de um ProductProvider");
  }
  return context;
}
