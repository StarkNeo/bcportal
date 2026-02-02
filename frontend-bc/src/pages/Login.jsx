import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import requests from "../services/requests";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserId } = useOutletContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await requests.login(email, password);
      setUserId(res.data.userId);
      if (res.data.userId && res.data.requiresPasswordReset) {
        navigate("/reset-password", { state: { userId: res.data.userId, email: email } });
        return;
      }

      if (res.data.requires2FASetup) {
        navigate("/setup-2fa", { state: { userId: res.data.userId } });
        return;
      }
      else if (res.data.requires2FA) {
        navigate("/verificar", { state: { userId: res.data.userId } });
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error en login");
    }
  };

  return (
    <div className="upload-container">
      <h1>Iniciar sesión</h1>

      <label>Email</label>
      <input
        type="email"
        onChange={e => setEmail(e.target.value)}
        placeholder="usuario@correo.com"
      />

      <label>Contraseña</label>
      <input
        type="password"
        onChange={e => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <button className="upload-btn" onClick={handleLogin}>
        Continuar
      </button>

      {error && <p className="status-message">{error}</p>}
    </div>
  );
}