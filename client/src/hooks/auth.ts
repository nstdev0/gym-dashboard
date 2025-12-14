import { apiFetch } from "@/api/apiFetch";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Calling checkAuth");
        const validToken: boolean = await apiFetch("/auth/verify-token", "POST", null, {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        })
        console.log("RESPUESTA USEAUTH=----->", validToken);
        if (!validToken) {
          setIsLogged(false);
          throw new Error("Token no valido");
        }
        
        setIsLogged(validToken);
      } catch (error) {
        console.log("ERROR USEAUTH=----->", error);
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
