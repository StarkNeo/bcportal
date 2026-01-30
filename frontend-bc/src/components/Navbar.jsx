import { NavLink } from "react-router-dom";
import "./navbar.css";
import Logout from "../pages/Logout";


export default function Navbar({ token, setToken, setUserId }) {
  return (
    <nav className="nav">
      <h2 className="logo">BC Portal</h2>

      {token !== null ? (
        <ul className="nav-links">
          <li><NavLink to="/inicio" className="nav-links">Inicio</NavLink></li>
          <li><NavLink to="/carga" className="nav-links">Carga</NavLink></li>
          <li><Logout token={token} setToken={setToken} setUserId={setUserId} /></li>


        </ul>) : ""}

    </nav>
  );
}