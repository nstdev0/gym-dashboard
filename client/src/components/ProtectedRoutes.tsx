import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/auth";

const ProtectedRoutes = ({ redirectPath = "/auth/sign-in" }) => {
  const { isLogged, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando permisos...</div>;
  }

  if (!isLogged) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
