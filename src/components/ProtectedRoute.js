import { useLocation } from "react-router-dom";
import { useContext } from "react";
import authService from "../services/authService";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ redirectPath = '/login', children }) {
    const { currentUser } = useContext(authService.UserContext);

    const location = useLocation();

    if (!currentUser) {
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    return children ? children : <Outlet />;
}
