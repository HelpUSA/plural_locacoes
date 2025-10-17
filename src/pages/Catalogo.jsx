// 📄 src/pages/Catalogo.jsx
import React from 'react'

const items = [
  {
    nome: "Cadeira Preta",
    desc: "Polipropileno reforçado",
    img: "/cadeira-preta.jpg",
    tag: "cadeiras"
  },
  {
    nome: "Cadeira Branca",
    desc: "Polipropileno reforçado",
    img: "/cadeira-branca.jpg",
    tag: "cadeiras"
  },
  {
    nome: "Mesa Redonda 1,20m",
    desc: "Até 8 lugares",
    img: "/mesa-redonda-120.jpg",
    tag: "mesas"
  },
  {
    nome: "Tenda 6x6",
    desc: "Modelo chapéu de bruxa",
    img: "/Tenda-6x6-branca.jpg",
    tag: "tendas"
  },
]

export default function Catalogo() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Catálogo</h1>
      <p className="text-neutral-400 mb-8">
        Seleção inicial de itens. Personalizamos conforme a necessidade do seu evento.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((it, i) => (
          <div
            key={i}
            className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/30 hover:bg-neutral-900/50 transition"
          >
            <img
              src={it.img}
              alt={it.nome}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{it.nome}</h3>
              <p className="text-sm text-neutral-400">{it.desc}</p>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300">
                  {it.tag}
                </span>
                <a
                  href={`https://wa.me/5583999087188?text=Quero%20orcamento%20para:%20${encodeURIComponent(it.nome)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-helpusOrange text-sm font-medium hover:underline"
                >
                  Pedir orçamento
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
