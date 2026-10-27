import { useQuery } from "@tanstack/react-query";
import { getFarmerProfile } from "../api/farmerProfile.api";

export const FARMER_PROFILE_QUERY_KEY = ["farmer-profile"];

export function useFarmerProfile(id) {
  return useQuery({
    queryKey: [...FARMER_PROFILE_QUERY_KEY, String(id)],
    queryFn: () => getFarmerProfile(id),
    enabled: Boolean(id),
    staleTime: 60000,
  });
}
