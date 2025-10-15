import React from 'react'
import VideoHero from '../components/VideoHero.jsx'
import FeatureCards from '../components/FeatureCards.jsx'
import Gallery from '../components/Gallery.jsx'
export default function Home(){
  return (<div>
    <VideoHero/><FeatureCards/><Gallery/>
    <section className="max-w-7xl mx-auto px-4 pb-20">
      <div className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900/30">
        <h2 className="text-xl font-semibold">Itens mais alugados</h2>
        <ul className="grid md:grid-cols-3 gap-4 mt-4 text-sm text-neutral-300 list-disc pl-5">
          <li>Cadeiras polipropileno (pretas e brancas)</li>
          <li>Mesas 70cm e 1,20m com toalhas</li>
          <li>Tenda 6x6 "chapéu de bruxa"</li>
          <li>Palco modular e pista de dança</li>
          <li>Cordões de luz e iluminação decorativa</li>
          <li>Som ambiente e pedestal</li>
        </ul>
      </div>
    </section>
  </div>)
}
