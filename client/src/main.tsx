import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import { ApiError } from "./lib/api/api-error.ts";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status >= 500) {
        toast.error(`Error de Servidor: ${error.message}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.suppressErrorToast) return;

      if (error instanceof ApiError) {
        // Caso A: Error de Validación (400/422) con múltiples campos
        if (error.details) {
          toast.error("Error de validación", {
            description: "Por favor revisa los campos marcados en rojo.",
          });
          return;
        }

        // Caso B: Error de Negocio (Ej: "Email ya existe", "Saldo insuficiente")
        if (error.code === "MEMBER_ALREADY_EXISTS") {
          toast.error("Error", {
            description: "Ya existe un miembro con ese documento.",
          });
        } else if (error.code === "PLAN_ALREADY_EXISTS") {
          toast.error("Error", {
            description: "Ya existe un plan con ese nombre.",
          });
        } else if (error.code === "UNIQUE_CONSTRAINT") {
          toast.error("Error", {
            description: "El recurso solicitado ya existe.",
          });
        } else if (error.code === "USER_ALREADY_EXISTS") {
          toast.error("Error", {
            description: "El email o nombre de usuario ya está en uso.",
          });
        } else if (error.code === "NOT_FOUND") {
          toast.error("Error", {
            description: "El recurso solicitado no existe.",
          });
        } else if (error.code === "CONNECTION_ERROR") {
          toast.error("Error de Conexión", {
            description: "No se pudo conectar con el servidor.",
          });
        } else {
          toast.error("Error", {
            description: error.message,
          });
        }
      } else {
        // Caso C: Error desconocido (Red, código roto en frontend)
        toast.error("Error inesperado", {
          description: "Intenta nuevamente más tarde.",
        });
      }
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
