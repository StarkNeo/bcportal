import { NavLink } from "react-router-dom";
import "./navbar.css";
import Logout from "../pages/Logout";


export default function Navbar({ token, setToken, setUserId }) {
  return (
    <nav className="nav">
      <h2 className="logo">BC Portal</h2>
      
      { token !== null ? (<ul className="nav-links">
        <li><NavLink to="/inicio">Inicio</NavLink></li>
        <li><NavLink to="/carga">Carga</NavLink></li>
        <li><NavLink><Logout token={token} setToken={setToken} setUserId={setUserId} /></NavLink></li>
        

      </ul>) : "" }
      
    </nav>
  );
}