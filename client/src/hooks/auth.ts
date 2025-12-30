import { apiFetch } from "@/lib/api/api-fetch";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const validToken: boolean = await apiFetch("/auth/verify-token", {
          method: "POST",
        });
        if (!validToken) {
          setIsLogged(false);
          throw new Error("Token no valido");
        }

        setIsLogged(validToken);
      } catch (error) {
        console.error(error);
        setIsLogged(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isLogged, isLoading };
}
