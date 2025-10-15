import React from 'react'
export default function Depoimentos(){
  const quotes = [
    { n:"Marina", t:"Excelente atendimento! Entregaram no horário e tudo limpo." },
    { n:"Carlos", t:"A tenda ficou perfeita. Montagem rápida e segura." },
    { n:"Diana", t:"Aluguei mesas e cadeiras para 80 pessoas e deu tudo certo." },
  ]
  return (<section className="max-w-6xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-semibold mb-8">Depoimentos</h1>
    <div className="grid md:grid-cols-3 gap-6">
      {quotes.map((q,i)=>(
        <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
          <p className="text-neutral-300">“{q.t}”</p>
          <p className="mt-3 text-sm text-neutral-400">— {q.n}</p>
        </div>
      ))}
    </div>
  </section>)
}
