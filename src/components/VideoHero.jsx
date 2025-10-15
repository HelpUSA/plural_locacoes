import React from 'react'
export default function VideoHero(){
  return (
    <section className="relative h-[72vh] md:h-[80vh] w-full overflow-hidden">
      <video className="absolute inset-0 w-full h-full object-cover"
             autoPlay muted loop playsInline poster="/fallback-hero.jpg">
        <source src="/video01.mp4" type="video/mp4"/>
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-neutral-950/80"></div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center">
          <img src="/logo-plural-256.png" alt="Plural Locações" className="mx-auto mb-6 opacity-95 drop-shadow-lg"/>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Plural Locações</h1>
          <p className="mt-3 text-neutral-300">Estrutura para festas e eventos em João Pessoa e região.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="/catalogo" className="px-6 py-3 rounded-xl bg-helpusOrange text-white font-medium hover:opacity-90 transition">Ver catálogo</a>
            <a href="/orcamentos" className="px-6 py-3 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition">Pedir orçamento</a>
          </div>
        </div>
      </div>
    </section>
  )
}
