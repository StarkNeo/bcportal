import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';

const Setup2FA = () => {
    const [qrUrl, setQrUrl] = useState(null);
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('');
    const { setToken } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const {userId} = location.state || {};
    
    useEffect(() => {
        if(!userId){
            navigate("/login");
            return;
        }
        const fetchQrCode = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/auth/setup-2fa?userId=${userId}`);
                setQrUrl(response.data.qrImageUrl);
            } catch (error) {
                console.error("Error fetching QR code:", error);
            };
        };
        fetchQrCode();
    }, [userId, navigate]);

    const handleVerify = async () => {
        try {
            const response = await axios.post("http://localhost:3001/auth/verify-2fa-setup", { userId, code });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setStatus(response.data.message);
            setTimeout(() => navigate("/inicio"), 1500);

        } catch (error) {
            console.error("Error verifying 2FA code:", error);
            setStatus(error.response?.data?.message || 'Error verificando el código');
        }
    }


    return (
        <div style={{ textAlign: "center" }}>
            <h1>Configurar Google Authenticator</h1>

            {qrUrl ? (
                <>
                    <img src={qrUrl} alt="QR Code" style={{ width: "250px", margin: "20px" }} />
                    <p>Escanea este código con Google Authenticator</p>

                    <input
                        type="text"
                        placeholder="Ingresa el código de 6 dígitos"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        style={{ padding: "10px", fontSize: "16px", marginTop: "20px" }}
                    />

                    <button
                        onClick={handleVerify}
                        style={{
                            display: "block",
                            margin: "20px auto",
                            padding: "10px 20px",
                            fontSize: "16px"
                        }}
                    >
                        Activar 2FA
                    </button>

                    {status && <p>{status}</p>}
                </>
            ) : (
                <p>Cargando QR...</p>
            )}
        </div>


    );
};

export default Setup2FA;