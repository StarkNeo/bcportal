import { useNavigate } from "react-router-dom";
import '../components/Navbar.css';
import requests from "../services/requests";

export default function Logout({ setToken, setUserId, token }) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await requests.logout(token);
      
      // limpiar estado global
      setToken(null);
      setUserId(null);

      // limpiar localStorage
      localStorage.removeItem("token");

      // redirigir
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Error en logout:", err);
      navigate("/login", { replace: true });
    }
  };

  return (
    <input type="button" onClick={handleLogout} className="btn-navlike" value="Cerrar sesión" />
     
    
  );
}