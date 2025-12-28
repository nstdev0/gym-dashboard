import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMembership, deleteMembership, updateMembership } from "./requests";

export const useCreateMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      queryClient.invalidateQueries({ queryKey: ["membership"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: string }) => deleteMembership(variables.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
