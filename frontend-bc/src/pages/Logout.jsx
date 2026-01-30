import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../components/Navbar.css';

export default function Logout({ setToken, setUserId, token }) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

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