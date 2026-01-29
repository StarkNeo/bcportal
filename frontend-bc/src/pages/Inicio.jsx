import { Link } from "react-router-dom";
import "./inicio.css";

export default function Inicio() {
  return (
    <div className="inicio-container">
      <h1>Bienvenido al Portal BC</h1>
      <p className="intro-text">Selecciona una opción para continuar</p>

      <div className="menu-grid">
        <Link to="/carga" className="menu-card">
          <h3>Carga de Balanza</h3>
          <p>Sube archivos Excel y procesa información contable</p>
        </Link>
        
      </div>
    </div>
  );
}