import axios from 'axios'

const baseUrl = 'http://localhost:3001'

const getClients = async () => {
    const request = await axios.get(`${baseUrl}/clientes`)
    return request.data
}

const uploadExcel = async (file, token) => {
    const request = await axios.post(`${baseUrl}/upload-excel`, file, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
    return request.data
}

//Login.jsx code during login
const login = async (email, password) => {
    const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
    return response;
}   

//Logout.jsx code during logout
const logout = async (token) => {
    const request = await axios.post(`${baseUrl}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return request.data;
}

const fetchQrCode = async (userId) => {
    const response = await axios.get(`${baseUrl}/auth/setup-2fa?userId=${userId}`);
    return response.data;
    
}
//Setup2FA.jsx code during setup
const verify2FASetup = async (userId, code) => {
    const response = await axios.post(`${baseUrl}/auth/verify-2fa-setup`, { userId, code });
    return response.data;
}

//Verify2FA.jsx code during login
const verify2FA = async (userId, code) => {
    const response = await axios.post(`${baseUrl}/auth/verify-2fa`, { userId, code });
    return response.data;
}

//ResetPassword.jsx code during password reset
const resetPassword = async (userId, newPassword) => {
    const response = await axios.post(`${baseUrl}/auth/reset-password`, { userId, newPassword });
    return response.data;
}



export default { getClients, uploadExcel, logout, fetchQrCode, verify2FASetup, verify2FA, resetPassword, login }