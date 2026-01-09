import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1>Página No Encontrada</h1>
      <Link
        className="mt-4 border border-red-900 px-4 py-2 text-red-900 hover:bg-red-900 hover:text-white rounded-2xl"
        to="/admin/dashboard/inicio"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
