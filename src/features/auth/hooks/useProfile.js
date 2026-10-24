import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/auth.api";
import { useAuth } from "./useAuth";

export const AUTH_PROFILE_QUERY_KEY = ["auth", "profile"];

export function useProfile() {
  const { token, updateUser } = useAuth();

  const query = useQuery({
    queryKey: AUTH_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await getProfile();
      return response.data;
    },
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (query.data) {
      updateUser(query.data);
    }
  }, [query.data, updateUser]);

  return query;
}
