import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

const INITIAL_PRODUCTS = [
  {
    id: "p1",
    sku: "MES-RED-120-01",
    nome: "Mesa Redonda 1,20m em MDF Nobre",
    categoria: "mesas",
    departamento: "mobiliario-lounges",
    precoDiaria: 40.0,
    precoSemanal: 180.0,
    imagem: "/mesas-e-cadeiras-01.jpeg",
    galeria: ["/mesas-e-cadeiras-01.jpeg", "/imagem01.jpg"],
    descricao: "Mesa redonda em MDF resistente de 15mm com bordas seladas e pés metálicos com travamento de segurança. Acomoda confortavelmente 8 lugares. Perfeita para jantares, aniversários e casamentos.",
    cor: "Madeira Natural / Pés Pretos",
    material: "MDF Nobre com Estrutura de Aço Carbono",
    dimensoes: "1,20m (Diâmetro) x 75cm (Altura)",
    pesoSuportado: "Até 100 kg distribuídos",
    especificacoes: {
      "Capacidade": "8 Pessoas Sentadas",
      "Travamento": "Pés Dobráveis de Pressão",
      "Uso Recomendado": "Recepções, Banquetes, Casamentos"
    },
    opcoes: [
      { id: "o1", nome: "Toalha Branca em Oxford (até o chão)", preco: 30.0 },
      { id: "o2", nome: "Cobre-Mancha Champanhe / Dourado", preco: 20.0 },
      { id: "o3", nome: "Arranjo de Mesa Decorativo", preco: 45.0 }
    ],
    estoque: 40,
    status: "ACTIVE",
    destaque: "🔥 Campeã de locações para casamentos e banquetes"
  },
  {
    id: "p2",
    sku: "KIT-MESA-QUAD-01",
    nome: "Conjunto Mesa Quadrada + 4 Cadeiras Plásticas",
    categoria: "conjuntos",
    departamento: "mobiliario-lounges",
    precoDiaria: 20.0,
    precoSemanal: 90.0,
    imagem: "/mesas-e-cadeiras-02.jpeg",
    galeria: ["/mesas-e-cadeiras-02.jpeg", "/imagem03.jpg"],
    descricao: "Kit prático composto por 1 mesa quadrada de plástico reforçado e 4 cadeiras de alta qualidade. Ideal para praias, churrascos, festas infantis e reuniões de família.",
    cor: "Branca Clean",
    material: "Polipropileno Injetado UV",
    dimensoes: "Mesa: 70cm x 70cm x 72cm",
    pesoSuportado: "INMETRO 182 kg",
    especificacoes: {
      "Composição": "1 Mesa Quadrada + 4 Cadeiras sem braço",
      "Material": "Polipropileno injetado com proteção UV",
      "Resistência Cadeira": "Certificada pelo INMETRO até 182kg"
    },
    opcoes: [
      { id: "o4", nome: "Toalha Quadrada para Mesa Plástica", preco: 15.0 }
    ],
    estoque: 120,
    status: "ACTIVE",
    destaque: "⭐ Excelente opção econômica para churrascos e praia"
  },
  {
    id: "p3",
    sku: "MES-RET-200-01",
    nome: "Mesa Retangular de Buffet 2,00m",
    categoria: "mesas",
    departamento: "mobiliario-lounges",
    precoDiaria: 40.0,
    precoSemanal: 180.0,
    imagem: "/mesas-e-cadeiras-03.jpeg",
    galeria: ["/mesas-e-cadeiras-03.jpeg", "/imagem04.jpg"],
    descricao: "Mesa retangular versátil para área de buffet, coffee break, apoio de bebidas, doces e recepção de convidados.",
    cor: "Madeira Compensado",
    material: "Compensado Naval Reforçado",
    dimensoes: "2,00m (C) x 0,90m (L) x 0,75m (A)",
    pesoSuportado: "Até 120 kg",
    especificacoes: {
      "Aplicação": "Área de Alimentos, Bar, Doces",
      "Estrutura": "Metálica Reforçada"
    },
    opcoes: [
      { id: "o5", nome: "Toalha Retangular Branca de Buffet (3m)", preco: 35.0 },
      { id: "o6", nome: "Saia de Mesa Plissada Branca", preco: 25.0 }
    ],
    estoque: 25,
    status: "ACTIVE",
    destaque: "Indispensável para área de alimentos e bar"
  },
  {
    id: "p4",
    sku: "CAD-PLAST-PR-01",
    nome: "Cadeira Plástica Preta Reforçada (INMETRO)",
    categoria: "cadeiras",
    departamento: "mobiliario-lounges",
    precoDiaria: 5.0,
    precoSemanal: 20.0,
    imagem: "/cadeira-preta.jpg",
    galeria: ["/cadeira-preta.jpg"],
    descricao: "Cadeira plástica monobloco preta, anatômica, empilhável e de higienização simples. Mantida em estado de nova.",
    cor: "Preta Fosca",
    material: "Polipropileno 100% Virgem",
    dimensoes: "42cm (L) x 88cm (A) x 45cm (P)",
    pesoSuportado: "INMETRO 182 kg",
    especificacoes: {
      "Empilhamento": "Até 20 unidades de forma segura",
      "Resistência": "Testada e aprovada até 182kg"
    },
    opcoes: [
      { id: "o7", nome: "Capa em Spandex / Tecido Preto", preco: 7.0 }
    ],
    estoque: 350,
    status: "ACTIVE",
    destaque: "Design anatômico e resistência extrema"
  },
  {
    id: "p5",
    sku: "CAD-PLAST-BR-01",
    nome: "Cadeira Plástica Branca Reforçada",
    categoria: "cadeiras",
    departamento: "mobiliario-lounges",
    precoDiaria: 5.0,
    precoSemanal: 20.0,
    imagem: "/cadeira-branca.jpg",
    galeria: ["/cadeira-branca.jpg"],
    descricao: "Cadeira branca higienizada com acabamento limpo. Combina com capas de tecido e decorações de alto padrão.",
    cor: "Branca Clean",
    material: "Polipropileno Reforçado UV",
    dimensoes: "42cm (L) x 88cm (A) x 45cm (P)",
    pesoSuportado: "Até 150 kg",
    especificacoes: {
      "Cor": "Branca",
      "Material": "Polipropileno reforçado"
    },
    opcoes: [
      { id: "o8", nome: "Capa de Tecido Branca com Laço", preco: 8.0 }
    ],
    estoque: 400,
    status: "ACTIVE",
    destaque: "Clean e elegante para qualquer ambientação"
  },
  {
    id: "p6",
    sku: "TEN-PIR-6X6-01",
    nome: "Tenda Piramidal 6x6m Chapéu de Bruxa (36m²)",
    categoria: "tendas",
    departamento: "estruturas-climatizacao",
    precoDiaria: 350.0,
    precoSemanal: 1200.0,
    imagem: "/Tenda-6x6-branca.jpg",
    galeria: ["/Tenda-6x6-branca.jpg"],
    descricao: "Tenda profissional tipo Chapéu de Bruxa para cobertura de grandes áreas. Acompanha transporte, montagem profissional, estaiamento e desmontagem inclusos.",
    cor: "Branca",
    material: "Aço Galvanizado Anticorrosivo e Lona PVC UV",
    dimensoes: "6,00m x 6,00m (36m²)",
    pesoSuportado: "Ventos até 60km/h",
    especificacoes: {
      "Área Coberta": "36m²",
      "Capacidade": "Acomoda até 40 pessoas sentadas ou 60 em pé",
      "Lona": "PVC Vinílico Antichamas com Proteção Térmica UV"
    },
    opcoes: [
      { id: "o9", nome: "Fechamento Lateral de Parede com Janela Transparente", preco: 80.0 },
      { id: "o10", nome: "Kit Iluminação Spot LED 400W para Tenda", preco: 120.0 },
      { id: "o11", nome: "Climatizador Evaporativo de Ar Industrial", preco: 200.0 }
    ],
    estoque: 12,
    status: "ACTIVE",
    destaque: "☔ Proteção total contra chuva e sol com montagem inclusa"
  },
  {
    id: "p7",
    sku: "KIT-PRAIA-CHURR-50",
    nome: "Kit Lounge Praia & Churrasco (Combo 50 Pessoas)",
    categoria: "conjuntos",
    departamento: "kits-ambientes",
    precoDiaria: 480.0,
    precoSemanal: 1700.0,
    imagem: "/mesas-e-cadeiras-02.jpeg",
    galeria: ["/mesas-e-cadeiras-02.jpeg", "/Tenda-6x6-branca.jpg"],
    descricao: "Combo de ambientação completo para 50 pessoas: 1 Tenda Piramidal 6x6m + 10 Mesas Quadradas Plásticas + 40 Cadeiras Plásticas Reforçadas.",
    cor: "Branco e Preto",
    material: "Lona PVC + Polipropileno",
    dimensoes: "36m² de Área de Evento",
    pesoSuportado: "Combo Completo",
    especificacoes: {
      "Composição": "1 Tenda 6x6m + 10 Mesas + 40 Cadeiras",
      "Economia": "Economize R$ 120,00 no combo comparado aos itens avulsos"
    },
    opcoes: [
      { id: "o12", nome: "10 Toalhas Quadradas de Mesa", preco: 100.0 }
    ],
    estoque: 10,
    status: "ACTIVE",
    isKit: true,
    destaque: "⭐ Campeão de Vendas para Aniversários e Churrascos"
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
          categoria: p.category?.slug || p.categoryId || "mesas",
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
