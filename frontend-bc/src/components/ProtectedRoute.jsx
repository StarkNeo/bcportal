import { Children } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function ProtectedRoute() {
    const { token } = useOutletContext();
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet context={token} />;
}