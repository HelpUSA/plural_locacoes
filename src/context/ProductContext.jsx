import React, { createContext, useContext, useState, useEffect } from "react";

const INITIAL_PRODUCTS = [
  {
    id: "mesa-redonda-120",
    nome: "Mesa Redonda 1,20m com Tampo",
    categoria: "mesas",
    subcategoria: "Mesas Sociais",
    precoDiaria: 40.0,
    imagem: "/mesas-e-cadeiras-01.jpeg",
    descricao: "Mesa redonda em MDF com pés reforçados. Acomoda confortavelmente até 8 pessoas. Ideal para recepções e casamentos.",
    destaque: "Mais vendida para casamentos e aniversários",
    especificacoes: {
      capacidade: "8 pessoas",
      diametro: "1,20m",
      material: "MDF e estrutura metálica"
    },
    opcoesAdicionais: [
      { id: "toalha-branca", nome: "Toalha Branca (até o chão)", preco: 30.0 },
      { id: "cobre-mancha", nome: "Cobre-Mancha Champanhe", preco: 20.0 }
    ],
    estoque: 35
  },
  {
    id: "conjunto-praia",
    nome: "Conjunto Mesa Quadrada + 4 Cadeiras Plásticas",
    categoria: "conjuntos",
    subcategoria: "Kits Práticos",
    precoDiaria: 20.0,
    imagem: "/mesas-e-cadeiras-02.jpeg",
    descricao: "Conjunto completo composto por 1 mesa quadrada plástica branca e 4 cadeiras reforçadas. Praticidade para churrascos, praia e eventos casuais.",
    destaque: "Melhor custo-benefício para eventos casuais",
    especificacoes: {
      capacidade: "4 pessoas",
      material: "Polipropileno injetado",
      resistencia: "Cadeiras até 150kg"
    },
    opcoesAdicionais: [],
    estoque: 100
  },
  {
    id: "mesa-retangular-200",
    nome: "Mesa Retangular 2,00m com Tampo",
    categoria: "mesas",
    subcategoria: "Mesas de Buffet",
    precoDiaria: 40.0,
    imagem: "/mesas-e-cadeiras-03.jpeg",
    descricao: "Mesa retangular espaçosa para montagem de buffet, coffee break, mesa de doces ou bancadas de apoio.",
    destaque: "Essencial para área de alimentação e buffet",
    especificacoes: {
      dimensoes: "2,00m x 0,90m",
      material: "Madeira tratada com estrutura dobrável"
    },
    opcoesAdicionais: [
      { id: "toalha-retangular", nome: "Toalha Retangular Branca", preco: 30.0 }
    ],
    estoque: 20
  },
  {
    id: "cadeira-preta-reforcada",
    nome: "Cadeira Plástica Preta Reforçada",
    categoria: "cadeiras",
    subcategoria: "Cadeiras Sem Braço",
    precoDiaria: 5.0,
    imagem: "/cadeira-preta.jpg",
    descricao: "Cadeira anatômica em polipropileno de alta resistência. Certificada pelo INMETRO.",
    destaque: "Resistência testada até 182kg",
    especificacoes: {
      cor: "Preta",
      material: "Polipropileno 100% virgem",
      empilhavel: "Sim"
    },
    opcoesAdicionais: [
      { id: "capa-cadeira", nome: "Capa de Cadeira Tecido Nobre", preco: 8.0 }
    ],
    estoque: 300
  },
  {
    id: "cadeira-branca-reforcada",
    nome: "Cadeira Plástica Branca Reforçada",
    categoria: "cadeiras",
    subcategoria: "Cadeiras Sem Braço",
    precoDiaria: 5.0,
    imagem: "/cadeira-branca.jpg",
    descricao: "Cadeira branca higienizada e conservada. Combina com qualquer estilo de decoração.",
    destaque: "Clean e versátil",
    especificacoes: {
      cor: "Branca",
      material: "Polipropileno",
      empilhavel: "Sim"
    },
    opcoesAdicionais: [
      { id: "capa-branca", nome: "Capa de Cadeira Branca", preco: 8.0 }
    ],
    estoque: 300
  },
  {
    id: "tenda-6x6-chapeu-bruxa",
    nome: "Tenda Piramidal 6x6m Chapéu de Bruxa",
    categoria: "tendas",
    subcategoria: "Tendas Cobertas",
    precoDiaria: 350.0,
    imagem: "/Tenda-6x6-branca.jpg",
    descricao: "Estrutura robusta em aço galvanizado com lona antichamas impermeável. Inclui montagem e fixação profissional pela equipe Plural.",
    destaque: "Proteção completa contra sol e chuva",
    especificacoes: {
      cobertura: "36m² (até 40 pessoas cobertas)",
      estrutura: "Aço galvanizado a fogo",
      lona: "TD500 impermeável e UV protect"
    },
    opcoesAdicionais: [
      { id: "fechamento-lateral", nome: "Fechamento Lateral por Parede (cada)", preco: 80.0 },
      { id: "iluminacao-tenda", nome: "Kit Iluminação LED embutida para Tenda", preco: 120.0 }
    ],
    estoque: 10
  }
];

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("plural_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar produtos salvos:", e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem("plural_products", JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `prod-${Date.now()}`
    };
    setProducts((prev) => [productWithId, ...prev]);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefault
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
