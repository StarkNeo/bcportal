import axios from 'axios'

const baseUrl = 'http://localhost:3001'

const getClients = async () => {    
    const request = await axios.get(`${baseUrl}/clientes`)
    return request.data
}

const uploadExcel = async(file, token)=>{
    console.log(file)
    const request = await axios.post(`${baseUrl}/upload-excel`,file,{headers:{Authorization: `Bearer ${token}`, 'Content-Type':'multipart/form-data'}})
    console.log(request.data)
    return request.data
}

const logout = async (token) => {
    
    const request = await axios.post(`${baseUrl}/auth/logout`, {}, {
        headers: {  Authorization: `Bearer ${token}` }
    });
    console.log("Logout response:", request.data);
    return request.data;
}

export default {getClients, uploadExcel, logout}