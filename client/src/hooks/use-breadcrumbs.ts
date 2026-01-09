import { useMemo } from "react";
import { useLocation } from "react-router-dom";

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  "/admin/dashboard/inicio": [
    { title: "Inicio", link: "/admin/dashboard/inicio" },
  ],
  "/admin/dashboard/miembros": [
    { title: "Inicio", link: "/admin/dashboard/inicio" },
    { title: "Miembros", link: "/admin/dashboard/miembros" },
  ],
  "/admin/dashboard/planes": [
    { title: "Inicio", link: "/admin/dashboard/inicio" },
    { title: "Planes", link: "/admin/dashboard/planes" },
  ],
  "/admin/dashboard/membresias": [
    { title: "Inicio", link: "/admin/dashboard/inicio" },
    { title: "Membresías", link: "/admin/dashboard/membresias" },
  ],
  "/admin/dashboard/usuarios": [
    { title: "Inicio", link: "/admin/dashboard/inicio" },
    { title: "Usuarios", link: "/admin/dashboard/usuarios" },
  ],
  "/admin/dashboard/profile": [
    { title: "Inicio", link: "/admin/dashboard/inicio" },
    { title: "Perfil", link: "/admin/dashboard/profile" },
  ],
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path === "/admin" ? "/admin/dashboard/inicio" : path,
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
