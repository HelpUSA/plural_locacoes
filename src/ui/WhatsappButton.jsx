import React from 'react'
export default function WhatsappButton(){
  const url = "https://wa.me/5583999087188?text=Ola%2C%20vim%20pelo%20site%20da%20Plural%20Locacoes%20e%20quero%20um%20orcamento."
  return (
    <a href={url} className="fixed bottom-6 right-6 z-50 rounded-full p-4 bg-green-500 hover:bg-green-400 transition animate-float animate-pulseGlow"
       aria-label="Fale no WhatsApp">
      <img src="/whatsapp.svg" alt="WhatsApp" className="h-7 w-7"/>
    </a>
  )
}
