import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api/cart.api";
import { useAuth } from "../../auth";
import { ROLES } from "../../../constants/roles";

export const CART_QUERY_KEY = "cart";

export function useCart() {
  const { user, isAuthenticated } = useAuth();
  const isBuyer = isAuthenticated && user?.role === ROLES.BUYER && Boolean(user?.id);

  return useQuery({
    queryKey: [CART_QUERY_KEY, user?.id],
    queryFn: async () => {
      const response = await getCart();
      return response.data;
    },
    enabled: isBuyer,
    staleTime: 30000,
  });
}

