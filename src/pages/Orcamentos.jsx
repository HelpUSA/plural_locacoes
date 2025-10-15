import React from 'react'
export default function Orcamentos(){
  return (<section className="max-w-5xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-semibold mb-4">Orçamentos</h1>
    <p className="text-neutral-300">Preferimos orçamento via WhatsApp para responder no ato.</p>
    <div className="mt-6">
      <a href="https://wa.me/5583999087188?text=Ola!%20Quero%20um%20orcamento%20para%20meu%20evento."
         className="px-6 py-3 rounded-xl bg-helpusOrange text-white font-medium hover:opacity-90 transition inline-block">
        Abrir WhatsApp
      </a>
    </div>
  </section>)
}
