// 📄 src/structure/SiteLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header.jsx";
import Footer from "../ui/Footer.jsx";
import WhatsappButton from "../ui/WhatsappButton.jsx";

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-helpusNavy text-neutral-100 font-sans">
      {/* Header fixo com leve sombra e animação de entrada */}
      <header className="sticky top-0 z-50 bg-helpusNavy/95 backdrop-blur border-b border-helpusBlue shadow-sm animate-fadeIn">
        <Header />
      </header>

      {/* Conteúdo principal com espaçamento e fade-in */}
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-6 md:py-10 animate-fadeIn">
        <Outlet />
      </main>

      {/* Rodapé com separador e tom contrastante */}
      <footer className="bg-helpusBlue border-t border-helpusSky animate-fadeIn">
        <Footer />
      </footer>

      {/* Botão do WhatsApp fixo no canto inferior direito */}
      <WhatsappButton />
    </div>
  );
}
