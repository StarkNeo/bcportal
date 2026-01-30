import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ResetPassword() {
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  //const {email} = useOutletContext();
  const location = useLocation();
  const { userId, email} = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
      if(!userId){
          navigate("/login");
          return;
      }
  }, [userId, navigate]);

  const handleSignUp = async () => {
    try {
      const res = await axios.post("http://localhost:3001/auth/reset-password", { userId, newPassword });
      if(res.data.userId){
        navigate("/login");
        return;
      }      
    } catch (err) {
      setError(err.response?.data?.message || "Error de actualización de contraseña");
    }
  };

  return (
    <div className="upload-container">
      <h1>Actualizar Contraseña</h1>
      {email && <p>Usuario: {email}</p>}
      <label>Actualizar Contraseña</label>
      <input
        type="password"
        onChange={e => setNewPassword(e.target.value)}
        placeholder="••••••••"
      />

      <button className="upload-btn" onClick={handleSignUp}>
        Continuar
      </button>

      {error && <p className="status-message">{error}</p>}
    </div>
  );
}