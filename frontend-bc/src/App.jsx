import { Outlet } from "react-router-dom";
import { useState} from "react";
import Navbar from "./components/Navbar";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
  return (
    <>
      <Navbar token={token} setToken={setToken} setUserId={setUserId} />
      <div style={{ padding: "2rem" }}>
        <Outlet context={{ userId, setUserId, token, setToken }} />
      </div>
    </>
  );
}