import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmOrderReceived } from "../api/orders.api";
import { BUYER_ORDERS_QUERY_KEY } from "./useBuyerOrders";
import { BUYER_ORDER_DETAIL_QUERY_KEY } from "./useBuyerOrderDetail";

export function useConfirmOrderReceived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      const response = await confirmOrderReceived(orderId);
      return response.data;
    },
    onSuccess: (updatedOrder, orderId) => {
      queryClient.setQueryData(
        [BUYER_ORDER_DETAIL_QUERY_KEY, String(orderId)],
        updatedOrder,
      );
      queryClient.invalidateQueries({ queryKey: [BUYER_ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [BUYER_ORDER_DETAIL_QUERY_KEY, String(orderId)],
      });
    },
  });
}
