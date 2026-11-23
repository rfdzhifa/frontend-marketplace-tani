import { useQuery } from "@tanstack/react-query";
import { getBuyerOrders } from "../api/orders.api";

export const BUYER_ORDERS_QUERY_KEY = "buyer-orders";

export function useBuyerOrders({ page = 1, limit = 10, status } = {}) {
  return useQuery({
    queryKey: [BUYER_ORDERS_QUERY_KEY, { page, limit, status: status || "ALL" }],
    queryFn: async () => {
      const response = await getBuyerOrders({ page, limit, status });
      return response.data;
    },
    staleTime: 20000,
  });
}
