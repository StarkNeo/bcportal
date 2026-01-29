import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

export default function Logout() {
  const navigate = useNavigate();
  const { setToken, setUserId, token } = useOutletContext();

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
    <button onClick={handleLogout} className="logout-btn">
      Cerrar sesión
    </button>
  );
}