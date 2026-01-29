import React from "react";
import { useState, useEffect } from "react";
import requests from "../services/requests";
import "./uploadbalanza.css";

export const UploadExcel = ({token}) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [rowsInserted, setRowsInserted] = useState(null);
    const [year, setYear] = useState("")
    const [month, setMonth] = useState("")
    const [rfc, setRfc] = useState("")
    const [clients, setClients] = useState([])

    useEffect(() => {
        const fetchClients = async () => {
            const data = await requests.getClients();
            setClients(data);
        };
        fetchClients();
    }, []);

    let arrayEjercicios = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]


    const handleLogout = async () => {
        await requests.logout(token);
        localStorage.removeItem('token');
        window.location.reload();
    }
    const handleChangeRfc = (event) => {
        setRfc(event.target.value)
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus('');
        setRowsInserted(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus('Selecciona un archivo primero');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('ejercicio', year);
        formData.append('mes', month);
        formData.append('rfc', rfc);

        try {
            setStatus('Subiendo y procesando...');
            const res = await requests.uploadExcel(formData, token);
            setStatus(res.message);
            setRowsInserted(res.rows);
        } catch (error) {
            console.error(error);
            setStatus('Error al subir o procesar el archivo');
        }
    };

    return (
        <div className="upload-container">
      <button className="logout-btn" onClick={handleLogout}>
        Cerrar Sesión
      </button>

      <h1>Carga de balanza (Excel → Postgres)</h1>

      <label htmlFor="cliente">Cliente</label>
      <select id="cliente" onChange={handleChangeRfc}>
        <option value="">-------------</option>
        {clients.map(client => (
          <option key={client.rfc} value={client.rfc}>
            {client.nombre}
          </option>
        ))}
      </select>

      <label htmlFor="ejercicio">Ejercicio</label>
      <select id="ejercicio" required onChange={e => setYear(e.target.value)}>
        <option value="0"></option>
        {arrayEjercicios.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <label htmlFor="mes">Periodo</label>
      <input
        type="number"
        id="mes"
        min="1"
        max="12"
        placeholder="1"
        title="Captura mes 1 a 12"
        onChange={e => setMonth(e.target.value)}
      />

      <label htmlFor="file">Archivo Excel</label>
      <input
        type="file"
        id="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />

      <button className="upload-btn" onClick={handleUpload}>
        Subir y procesar
      </button>

      {status && (
        <p className="status-message">
          {status} {rowsInserted != null && ` | Filas insertadas: ${rowsInserted}`}
        </p>
      )}
    </div>

    );
}

export default UploadExcel;