// 📄 src/components/ProdutosMesasECadeiras.jsx
import React from "react";

const produtos = [
  {
    id: "mesa-redonda",
    titulo: "Mesa Redonda com Tampo",
    preco: "R$ 40 /un",
    imagem: "/mesas-e-cadeiras-01.jpg", // se manteve com espaços: encodeURI("/mesas e cadeiras01.jpeg")
    itens: [
      { nome: "Cadeira de plástico com capa", valor: "R$ 10 /un" },
      { nome: "Toalha branca (até o chão)", valor: "R$ 30 /un" },
      { nome: "Cobre-mancha champanhe", valor: "R$ 20 /un" },
    ],
    destaque: "Combinação elegante para casamentos e aniversários ao ar livre.",
  },
  {
    id: "conjunto-praia",
    titulo: "Conjunto de Mesa com 4 Cadeiras",
    preco: "R$ 20,00 /conjunto",
    imagem: "/mesas-e-cadeiras-02.jpg", // ou encodeURI("/mesas e cadeiras02.jpeg")
    itens: [
      { nome: "Mesa quadrada plástica", valor: "Inclusa" },
      { nome: "4 cadeiras plásticas", valor: "Inclusas" },
    ],
    destaque: "Perfeito para praia, churrascos e eventos casuais.",
  },
  {
    id: "mesa-retangular",
    titulo: "Mesa Retangular com Tampo",
    preco: "R$ 40 /un",
    imagem: "/mesas-e-cadeiras-03.jpg", // ou encodeURI("/mesas e cadeiras03.jpeg")
    itens: [
      { nome: "Cadeira de plástico com capa", valor: "R$ 10 /un" },
      { nome: "Toalha branca (até o chão)", valor: "R$ 30 /un" },
      { nome: "Caminho de mesa champanhe", valor: "R$ 20 /un" },
    ],
    destaque: "Layout versátil para buffet, coffee break e mesas comunitárias.",
  },
];

function Card({ p }) {
  return (
    <div className="group rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden shadow-lg hover:shadow-xl transition-all">
      <div className="aspect-[16/11] overflow-hidden">
        {/* Se não renomear os arquivos, troque p.imagem por encodeURI(p.imagemComEspaco) */}
        <img
          src={p.imagem}
          alt={p.titulo}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-semibold text-lg">{p.titulo}</h3>
          <span className="px-2 py-1 text-sm rounded-md bg-helpusOrange/15 text-helpusOrange font-medium">
            {p.preco}
          </span>
        </div>
        {p.destaque && (
          <p className="text-sm text-neutral-400 mt-2">{p.destaque}</p>
        )}
        <ul className="mt-4 space-y-1.5 text-sm">
          {p.itens.map((i) => (
            <li
              key={i.nome}
              className="flex items-center justify-between border-b border-neutral-800/70 py-1"
            >
              <span className="text-neutral-300">{i.nome}</span>
              <span className="text-neutral-400">{i.valor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ProdutosMesasECadeiras() {
  return (
    <section id="mesas-e-cadeiras" className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            Mesas, Cadeiras & Enxoval
          </h2>
          <p className="text-neutral-400 mt-2">
            Aluguel para festas e eventos em João Pessoa. Itens podem ser
            contratados separadamente ou em conjunto.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {produtos.map((p) => (
            <Card key={p.id} p={p} />
          ))}
        </div>

        {/* Serviços adicionais */}
        <div className="mt-10 md:mt-14 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 md:p-6">
          <h3 className="font-semibold text-lg mb-3">Serviços adicionais</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-neutral-800/70 px-4 py-3">
              <span className="text-neutral-300">
                Frete urbano (João Pessoa)
              </span>
              <span className="text-neutral-200 font-medium">R$ 120–250</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-neutral-800/70 px-4 py-3">
              <span className="text-neutral-300">Montagem e retirada</span>
              <span className="text-neutral-200 font-medium">R$ 250–450</span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            * Valores de frete variam por bairro. Consulte disponibilidade para
            outras cidades.
          </p>
        </div>
      </div>
    </section>
  );
}
