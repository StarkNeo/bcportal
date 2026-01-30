import { useState, useEffect} from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

export default function Verify2FA() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const {setToken} = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  
  useEffect(() => {
      if(!userId){
          navigate("/login");
          return;
      }
  }, [userId, navigate]);


  
  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:3001/auth/verify-2fa", {
        userId,
        code
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      navigate("/inicio");
    } catch (err) {
      setError(err.response?.data?.message || "Código incorrecto");
    }
  };

  return (
    <div className="upload-container">
      <h1>Verificación MFA</h1>

      <label>Código de autenticación</label>
      <input
        type="text"
        onChange={e => setCode(e.target.value)}
        placeholder="123456"

      />

      <button className="upload-btn" onClick={handleVerify}>
        Verificar
      </button>

      {error && <p className="status-message">{error}</p>}
    </div>
  );
}