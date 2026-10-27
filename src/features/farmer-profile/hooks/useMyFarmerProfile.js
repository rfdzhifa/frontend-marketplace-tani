import { useQuery } from "@tanstack/react-query";
import { getMyFarmerProfile } from "../api/farmerProfile.api";
import { useAuth } from "../../auth";
import { ROLES } from "../../../constants/roles";

export const MY_FARMER_PROFILE_QUERY_KEY = ["farmer-profile", "me"];

export function useMyFarmerProfile() {
  const { token, user } = useAuth();
  const isSeller = user?.role === ROLES.SELLER;

  return useQuery({
    queryKey: MY_FARMER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await getMyFarmerProfile();
      return response.data;
    },
    enabled: Boolean(token) && isSeller,
    staleTime: 30000,
  });
}
