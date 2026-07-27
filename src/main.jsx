import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Provedores de Estado Reativo & Autenticação
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// Estrutura principal
import SiteLayout from "./structure/SiteLayout.jsx";

// Páginas
import Home from "./pages/Home.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import QuemSomos from "./pages/QuemSomos.jsx";
import ComoFunciona from "./pages/ComoFunciona.jsx";
import Orcamentos from "./pages/Orcamentos.jsx";
import Depoimentos from "./pages/Depoimentos.jsx";
import Contato from "./pages/Contato.jsx";
import Checkout from "./pages/Checkout.jsx";
import ConfirmacaoPedido from "./pages/ConfirmacaoPedido.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import MinhaConta from "./pages/MinhaConta.jsx";

// Configuração das rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "catalogo", element: <Catalogo /> },
      { path: "quem-somos", element: <QuemSomos /> },
      { path: "como-funciona", element: <ComoFunciona /> },
      { path: "orcamentos", element: <Orcamentos /> },
      { path: "depoimentos", element: <Depoimentos /> },
      { path: "contato", element: <Contato /> },
      { path: "checkout", element: <Checkout /> },
      { path: "confirmacao-pedido", element: <ConfirmacaoPedido /> },
      { path: "admin", element: <Admin /> },
      { path: "login", element: <Login /> },
      { path: "cadastro", element: <Cadastro /> },
      { path: "minha-conta", element: <MinhaConta /> },
    ],
  },
]);

// Renderização principal com os provedores de estado
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);
