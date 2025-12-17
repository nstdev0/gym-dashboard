import { Navigate, Outlet } from "react-router-dom";

// Asumimos que este es tu hook.
// Si tu hook devuelve un objeto, ajusta la desestructuración.
import { useAuth } from "../hooks/auth";

const ProtectedRoutes = ({ redirectPath = "/auth/sign-in" }) => {
  const { isLogged, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando permisos...</div>;
  }

  if (!isLogged) {
    // replace: true evita que el usuario pueda volver atrás con el botón del navegador
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
