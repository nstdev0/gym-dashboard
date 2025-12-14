import { Navigate, Outlet } from "react-router-dom";

// Asumimos que este es tu hook.
// Si tu hook devuelve un objeto, ajusta la desestructuración.
import { useAuth } from "../hooks/auth";

const ProtectedRoute = ({ redirectPath = "/auth/sign-in" }) => {
  const { isLogged, isLoading } = useAuth(); // Tu lógica de autenticación

  if (isLoading) {
    return <div>Cargando permisos...</div>;
  }

  // Verificación: Si NO está logueado (o no cumple la condición)
  if (!isLogged) {
    // replace: true evita que el usuario pueda volver atrás con el botón del navegador
    return <Navigate to={redirectPath} replace />;
  }

  // Si está logueado, renderiza las rutas hijas (children)
  return <Outlet />;
};

export default ProtectedRoute;
