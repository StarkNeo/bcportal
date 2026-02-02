import { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import requests from "../services/requests";

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
                const response = await requests.fetchQrCode(userId);
                setQrUrl(response.qrImageUrl);
            } catch (error) {
                console.error("Error fetching QR code:", error);
            };
        };
        fetchQrCode();
    }, [userId, navigate]);

    const handleVerify = async () => {
        try {
            const response = await requests.verify2FASetup(userId, code);
            localStorage.setItem('token', response.token);
            setToken(response.token);
            setStatus(response.message);
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