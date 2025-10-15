import React from 'react'
const imgs = ['/imagem01.jpg','/imagem02.jpg','/imagem03.jpg','/imagem04.jpg']
export default function Gallery(){
  return (<section className="max-w-7xl mx-auto px-4 py-16">
    <h2 className="text-2xl font-semibold mb-6">Alguns trabalhos</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {imgs.map((src, i)=>(
        <img key={i} src={src} alt={`Galeria ${i+1}`} className="rounded-xl border border-neutral-800 hover:opacity-90 transition"/>
      ))}
    </div>
  </section>)
}
