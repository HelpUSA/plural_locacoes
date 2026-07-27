import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header.jsx";
import Footer from "../ui/Footer.jsx";
import WhatsappButton from "../ui/WhatsappButton.jsx";
import CartDrawer from "../components/CartDrawer.jsx";

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans">
      <Header />
      <main className="flex-1 animate-fadeIn">
        <Outlet />
      </main>
      <Footer />
      <WhatsappButton />
      <CartDrawer />
    </div>
  );
}
