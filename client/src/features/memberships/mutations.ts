import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMembership, deleteMembership, updateMembership } from "./requests";
import { toast } from "sonner";

export const useCreateMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMembership,
    onSuccess: () => {
      toast.success("Membresía creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
  });
};

export const useUpdateMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMembership,
    onSuccess: () => {
      toast.success("Membresía actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      queryClient.invalidateQueries({ queryKey: ["membership"] });
    },
  });
};

export const useDeleteMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: string }) => deleteMembership(variables.id),
    onSuccess: () => {
      toast.success("Membresía eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
  });
};
