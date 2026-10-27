import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveFarmerProfile } from "../api/farmerProfile.api";
import { FARMER_PROFILE_QUERY_KEY } from "./useFarmerProfile";

export function useSaveFarmerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveFarmerProfile,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: FARMER_PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success(response?.message || "Profil petani berhasil disimpan");
    },
  });
}
