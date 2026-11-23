import { useQuery } from "@tanstack/react-query";
import { getBuyerOrderDetail } from "../api/orders.api";

export const BUYER_ORDER_DETAIL_QUERY_KEY = "buyer-order-detail";

export function useBuyerOrderDetail(orderId) {
  return useQuery({
    queryKey: [BUYER_ORDER_DETAIL_QUERY_KEY, String(orderId)],
    queryFn: async () => {
      const response = await getBuyerOrderDetail(orderId);
      return response.data;
    },
    enabled: Boolean(orderId),
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
