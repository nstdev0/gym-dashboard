import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan, deletePlan, updatePlan } from "./requests";
// import { toast } from "sonner" // Or your toast library

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      // toast.success("Plan creado exitosamente")
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error) => {
      // toast.error("Error al crear el plan")
      console.error(error);
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
        // toast.success("Plan actualizado exitosamente")
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan"] });
    },
    onError: (error) => {
        // toast.error("Error al actualizar el plan")
      console.error(error);
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: string }) => deletePlan(variables.id),
    onSuccess: () => {
        // toast.success("Plan eliminado exitosamente")
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error) => {
        // toast.error("Error al eliminar el plan")
      console.error(error);
    },
  });
};
