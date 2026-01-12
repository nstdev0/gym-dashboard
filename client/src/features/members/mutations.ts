import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMember, deleteMember, updateMember } from "./requests";
import { toast } from "sonner";
import type { CreateMemberDto, UpdateMemberDto } from "@/DTOs/members.dto";

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberDto) => createMember(data),
    onSuccess: () => {
      toast.success("Miembro creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberDto }) =>
      updateMember(id, data),
    onSuccess: () => {
      toast.success("Miembro actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteMember(id),
    onSuccess: () => {
      toast.success("Miembro eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};
