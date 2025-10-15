import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import SiteLayout from './structure/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import Catalogo from './pages/Catalogo.jsx'
import QuemSomos from './pages/QuemSomos.jsx'
import ComoFunciona from './pages/ComoFunciona.jsx'
import Orcamentos from './pages/Orcamentos.jsx'
import Depoimentos from './pages/Depoimentos.jsx'
import Contato from './pages/Contato.jsx'

const router = createBrowserRouter([{
  path: "/", element: <SiteLayout/>, children: [
    { index: true, element: <Home/> },
    { path: "catalogo", element: <Catalogo/> },
    { path: "quem-somos", element: <QuemSomos/> },
    { path: "como-funciona", element: <ComoFunciona/> },
    { path: "orcamentos", element: <Orcamentos/> },
    { path: "depoimentos", element: <Depoimentos/> },
    { path: "contato", element: <Contato/> },
  ]
}])

createRoot(document.getElementById('root')).render(<RouterProvider router={router}/>)
