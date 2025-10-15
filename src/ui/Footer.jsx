import React from 'react'
export default function Footer(){
  return (<footer className="mt-16 border-t border-neutral-800 bg-neutral-950/70">
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <img src="/logo-plural-64.png" alt="Plural Locações" className="h-9 w-9 rounded"/>
          <div><p className="font-semibold">Plural Locações</p>
            <p className="text-xs text-neutral-400 -mt-1">Festas & Eventos</p></div>
        </div>
        <p className="text-sm text-neutral-400">Aluguel de mesas, cadeiras, tendas, iluminação e muito mais.</p>
      </div>
      <div>
        <p className="font-semibold mb-3">Contato</p>
        <ul className="space-y-2 text-sm">
          <li>WhatsApp: <a className="text-helpusOrange" href="https://wa.me/5583999087188">+55 83 99908-7188</a></li>
          <li>Instagram: <a className="text-helpusOrange" href="https://instagram.com/plural_locacoes" target="_blank">/plural_locacoes</a></li>
          <li>Endereço: Parque Solon de Lucena 142, Sala 105 — João Pessoa/PB</li>
        </ul>
      </div>
      <div>
        <p className="font-semibold mb-3">Links</p>
        <ul className="space-y-2 text-sm">
          <li><a href="/catalogo">Catálogo</a></li>
          <li><a href="/orcamentos">Orçamentos</a></li>
          <li><a href="/como-funciona">Como funciona</a></li>
          <li><a href="/contato">Contato</a></li>
        </ul>
      </div>
      <div>
        <p className="font-semibold mb-3">Horário</p>
        <p className="text-sm text-neutral-400">Seg a Sáb: 08h-18h<br/>Dom: fechado</p>
      </div>
    </div>
    <div className="text-center text-xs text-neutral-500 py-4 border-t border-neutral-800">
      © {new Date().getFullYear()} Plural Locações. Todos os direitos reservados.
    </div>
  </footer>)
}
