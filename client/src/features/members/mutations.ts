import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMember, deleteMember, updateMember } from "./requests";
import type { MemberInsert } from "@/entities/member";

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberInsert) => createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      console.error(error);
      alert("Error al crear miembro");
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MemberInsert }) =>
      updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      console.error(error);
      alert("Error al actualizar miembro");
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      console.error(error);
      alert("Error al eliminar");
    },
  });
};

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner"; // O 'react-hot-toast'
// import { deleteMember } from "./requests";

// // Definimos props opcionales por si el componente quiere ejecutar algo extra
// interface UseDeleteMemberProps {
//   onSuccess?: () => void;
//   onError?: (error: unknown) => void;
// }

// export const useDeleteMember = ({
//   onSuccess,
//   onError,
// }: UseDeleteMemberProps = {}) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: deleteMember,

//     onSuccess: async () => {
//       // 1. Feedback visual inmediato
//       toast.success("Miembro eliminado correctamente");

//       // 2. Refrescar datos en segundo plano
//       // Usamos 'await' si queremos asegurarnos que la recarga termine antes de seguir
//       await queryClient.invalidateQueries({ queryKey: ["members"] });

//       // 3. Ejecutar callback del componente (ej: cerrar modal)
//       if (onSuccess) onSuccess();
//     },

//     onError: (error: any) => {
//       // Lógica para extraer el mensaje de error de tu backend
//       const description =
//         error?.response?.data?.error?.description || "Error desconocido";

//       toast.error(`No se pudo eliminar: ${description}`);

//       if (onError) onError(error);
//     },
//   });
// };
