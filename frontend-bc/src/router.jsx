import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, BrowserRouter, Routes, Route } from 'react-router';
import App from './App';
import Inicio from './pages/Inicio';
import Carga from './pages/Carga';
import Login from './pages/Login';
import Verify2FA from './pages/Verify2FA';
import Setup2FA from './pages/Setup2FA';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,   // <-- ESTE ES EL LAYOUT QUE PROVEE EL CONTEXTO
        children: [
            { path: "/", element: <Login /> },  // <-- REDIRECCIÓN INICIAL A LOGIN
            { path: "login", element: <Login /> },
            { path: "reset-password", element: <ResetPassword /> },
            { path: "setup-2fa", element: <Setup2FA /> },
            { path: "verificar", element: <Verify2FA /> },
            {
                element: <ProtectedRoute />,   // <-- BLOQUE PROTEGIDO
                children: [
                    { path: "inicio", element: <Inicio /> },
                    { path: "carga", element: <Carga /> },   // <-- AQUÍ DEBE ESTAR

                ]
            }
        ]
    }
]);

export default router;


