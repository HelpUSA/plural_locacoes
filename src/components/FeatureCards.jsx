import React from 'react'
const features = [
  { title: "Entrega e montagem", desc: "Equipe para entregar, montar e desmontar com segurança."},
  { title: "Itens higienizados", desc: "Produtos limpos e revisados a cada locação."},
  { title: "Atendimento ágil", desc: "WhatsApp com resposta rápida e orçamento claro."},
  { title: "Eventos de todos os portes", desc: "Do aniversário íntimo ao evento corporativo."},
]
export default function FeatureCards(){
  return (<section className="max-w-7xl mx-auto px-4 py-16">
    <div className="grid md:grid-cols-4 gap-6">
      {features.map((f,i)=>(
        <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
          <h3 className="font-semibold text-lg">{f.title}</h3>
          <p className="text-sm text-neutral-400 mt-2">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>)
}
