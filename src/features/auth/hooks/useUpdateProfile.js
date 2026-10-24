import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfile as updateProfileApi } from "../api/auth.api";
import { useAuth } from "./useAuth";
import { AUTH_PROFILE_QUERY_KEY } from "./useProfile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (payload) =>
      updateProfileApi({
        name: payload.name,
        phone: payload.phone,
      }),
    onSuccess: (response) => {
      const updatedUser = response?.data;
      if (updatedUser) {
        updateUser(updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: AUTH_PROFILE_QUERY_KEY });
      toast.success(response?.message || "Profil berhasil diperbarui");
    },
  });
}
