import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
const MenuLink = ({to, children}) => (
  <NavLink to={to} className={({isActive}) =>
    `px-4 py-2 rounded-xl hover:bg-helpusBlue/60 transition ${isActive ? 'text-helpusOrange' : 'text-neutral-200'}`}>
    {children}
  </NavLink>)
export default function Header(){
  const [open,setOpen]=useState(false)
  return (<header className="sticky top-0 z-40 backdrop-blur bg-neutral-950/70 border-b border-neutral-800/50">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo-plural-64.png" alt="Plural Locações" className="h-10 w-10 rounded"/>
        <div className="leading-5"><p className="font-semibold tracking-wide">Plural Locações</p>
        <p className="text-xs text-neutral-400 -mt-1">Festas & Eventos</p></div>
      </Link>
      <nav className="hidden md:flex items-center gap-1">
        <MenuLink to="/catalogo">Catálogo</MenuLink>
        <MenuLink to="/como-funciona">Como funciona</MenuLink>
        <MenuLink to="/quem-somos">Quem somos</MenuLink>
        <MenuLink to="/depoimentos">Depoimentos</MenuLink>
        <MenuLink to="/orcamentos">Orçamentos</MenuLink>
        <MenuLink to="/contato">Contato</MenuLink>
        <a href="https://wa.me/5583999087188?text=Ola%2C%20vim%20pelo%20site%20da%20Plural%20Locacoes%20e%20quero%20um%20orcamento."
           className="ml-2 px-4 py-2 rounded-xl bg-helpusOrange text-white font-medium hover:opacity-90 transition">WhatsApp</a>
      </nav>
      <button onClick={()=>setOpen(!open)} aria-label="Abrir menu"
        className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-neutral-700">
        <div className="space-y-1.5">
          <span className="block h-0.5 w-6 bg-neutral-200"></span>
          <span className="block h-0.5 w-6 bg-neutral-200"></span>
          <span className="block h-0.5 w-6 bg-neutral-200"></span>
        </div>
      </button>
    </div>
    {open && (<div className="md:hidden border-t border-neutral-800">
      <div className="px-4 py-2 flex flex-col">
        <NavLink to="/catalogo" onClick={()=>setOpen(false)} className="py-3">Catálogo</NavLink>
        <NavLink to="/como-funciona" onClick={()=>setOpen(false)} className="py-3">Como funciona</NavLink>
        <NavLink to="/quem-somos" onClick={()=>setOpen(false)} className="py-3">Quem somos</NavLink>
        <NavLink to="/depoimentos" onClick={()=>setOpen(false)} className="py-3">Depoimentos</NavLink>
        <NavLink to="/orcamentos" onClick={()=>setOpen(false)} className="py-3">Orçamentos</NavLink>
        <NavLink to="/contato" onClick={()=>setOpen(false)} className="py-3">Contato</NavLink>
        <a className="py-3 text-helpusOrange font-semibold"
          href="https://wa.me/5583999087188?text=Ola%2C%20vim%20pelo%20site%20da%20Plural%20Locacoes%20e%20quero%20um%20orcamento.">WhatsApp</a>
      </div></div>)}
  </header>)
}
