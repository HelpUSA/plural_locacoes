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
    galeria: ["/mesas-e-cadeiras-01.jpeg"],
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
  },
  {
    id: "p2",
    sku: "KIT-PRAIA-02",
    nome: "Conjunto Mesa Quadrada + 4 Cadeiras Plásticas",
    categoria: "Combos & Kits Prontos",
    categoriaName: "Combos & Kits Prontos",
    departamento: "kits-ambientes",
    precoDiaria: 20.0,
    precoSemanal: 80.0,
    imagem: "/mesas-e-cadeiras-02.jpeg",
    galeria: ["/mesas-e-cadeiras-02.jpeg"],
    descricao: "Conjunto prático com 1 mesa quadrada plástica branca e 4 cadeiras bistro reforçadas. Ideal para praia, churrascos e eventos casuais.",
    cor: "Branca Clean",
    material: "Polipropileno 100% Injetado",
    dimensoes: "Mesa 70cm x 70cm",
    pesoSuportado: "Cadeiras até 182 kg (INMETRO)",
    especificacoes: {
      "Capacidade": "4 Pessoas Sentadas",
      "Uso": "Praia, Varanda, Churrascos"
    },
    opcoes: [],
    estoque: 100,
    status: "ACTIVE",
    isKit: true,
    destaque: "⭐ Melhor Custo-Benefício para Eventos Casuais"
  },
  {
    id: "p3",
    sku: "MES-PRAN-200-03",
    nome: "Mesa Retangular Pranchão 2,00m x 0,90m",
    categoria: "Mesas & Bancadas",
    categoriaName: "Mesas & Bancadas",
    departamento: "mobiliario-lounges",
    precoDiaria: 40.0,
    precoSemanal: 180.0,
    imagem: "/mesas-e-cadeiras-03.jpeg",
    galeria: ["/mesas-e-cadeiras-03.jpeg"],
    descricao: "Mesa pranchão retangular espaçosa para montagem de ilhas de buffet, mesas de doces, coffee break ou bancadas corporativas.",
    cor: "Branco Granitado",
    material: "PEAD de Alta Densidade Tampo Inteiriço & Pés de Aço",
    dimensoes: "2,00m x 0,90m x 75cm",
    pesoSuportado: "Até 180 kg distribuídos",
    especificacoes: {
      "Capacidade": "8 Lugares ou Buffet",
      "Estrutura": "Aço Tubular Rebatível"
    },
    opcoes: [
      { id: "o3", nome: "Toalha Retangular Branca", preco: 30.0 }
    ],
    estoque: 30,
    status: "ACTIVE",
    destaque: "🍲 Essencial para Área de Buffet e Alimentação"
  },
  {
    id: "p4",
    sku: "CAD-BIS-BRAN-04",
    nome: "Cadeira Bistrô Plástica Branca Reforçada",
    categoria: "Assentos & Cadeiras",
    categoriaName: "Assentos & Cadeiras",
    departamento: "mobiliario-lounges",
    precoDiaria: 5.0,
    precoSemanal: 20.0,
    imagem: "/mesas-e-cadeiras-01.jpeg",
    galeria: ["/mesas-e-cadeiras-01.jpeg"],
    descricao: "Cadeira bistrô branca higienizada com certificação INMETRO de resistência. Empilhável, versátil e lavável.",
    cor: "Branca Clean",
    material: "Polipropileno Alta Densidade",
    dimensoes: "52cm x 84cm x 54cm",
    pesoSuportado: "Até 182 kg (Selo INMETRO)",
    especificacoes: {
      "Empilhável": "Sim",
      "Certificação": "INMETRO 182 kg"
    },
    opcoes: [
      { id: "o4", nome: "Capa Tecido Nobre com Laço", preco: 8.0 }
    ],
    estoque: 300,
    status: "ACTIVE",
    destaque: "🛡️ Certificação Oficial de Segurança INMETRO"
  },
  {
    id: "p5",
    sku: "CAD-BIS-PRET-05",
    nome: "Cadeira Bistrô Plástica Preta Reforçada",
    categoria: "Assentos & Cadeiras",
    categoriaName: "Assentos & Cadeiras",
    departamento: "mobiliario-lounges",
    precoDiaria: 5.0,
    precoSemanal: 20.0,
    imagem: "/mesas-e-cadeiras-02.jpeg",
    galeria: ["/mesas-e-cadeiras-02.jpeg"],
    descricao: "Cadeira bistrô preta monobloco. Design discreto e moderno para congressos, feiras gastronômicas e eventos noturnos.",
    cor: "Preta Fosca",
    material: "Polipropileno 100% Reciclável",
    dimensoes: "52cm x 84cm x 54cm",
    pesoSuportado: "Até 182 kg",
    especificacoes: {
      "Empilhável": "Sim",
      "Uso": "Noturno, Congressos e Feiras"
    },
    opcoes: [],
    estoque: 250,
    status: "ACTIVE",
    destaque: "🖤 Elegância e Discreção para Congressos"
  },
  {
    id: "p6",
    sku: "TEN-PIR-6X6-06",
    nome: "Tenda Piramidal 6x6m Chapéu de Bruxa",
    categoria: "Tendas & Coberturas",
    categoriaName: "Tendas & Coberturas",
    departamento: "coberturas-estruturas",
    precoDiaria: 350.0,
    precoSemanal: 1300.0,
    imagem: "/mesas-e-cadeiras-03.jpeg",
    galeria: ["/mesas-e-cadeiras-03.jpeg"],
    descricao: "Estrutura robusta em aço galvanizado a fogo com lona PVC blackout impermeável e anti-chamas. Cobertura total de 36m² com montagem inclusa.",
    cor: "Branca Blackout Térmica",
    material: "Lona PVC TD1000 & Aço Galvanizado",
    dimensoes: "6,00m x 6,00m (Pé direito 3,00m)",
    pesoSuportado: "Resiste a ventos até 65 km/h",
    especificacoes: {
      "Cobertura": "36m² Úteis (até 40 pessoas)",
      "Montagem": "Equipe Técnica Inclusa"
    },
    opcoes: [],
    estoque: 10,
    status: "ACTIVE",
    destaque: "⛺ Cobertura Impermeável & Proteção Sol/Chuva"
  }
];

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("plural_products_catalog");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
      } catch (e) {}
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
