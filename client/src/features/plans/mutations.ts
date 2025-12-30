import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan, deletePlan, updatePlan } from "./requests";
import { toast } from "sonner";

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      toast.success("Plan registrado");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      toast.success("Plan actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan"] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: string }) => deletePlan(variables.id),
    onSuccess: () => {
      toast.success("Plan eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};
