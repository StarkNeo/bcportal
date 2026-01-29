import { createBrowserRouter } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Carga from './pages/Carga';
import Login from './pages/Login';
import Verify2FA from './pages/Verify2FA';
import App from './App';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Login /> },
            { path: "/inicio", element: <Inicio /> },
            { path: "/carga", element: <Carga /> },
            { path: "/login", element: <Login /> },
            { path: "/verificar", element: <Verify2FA /> }
        ]
    }

]);

export default router;