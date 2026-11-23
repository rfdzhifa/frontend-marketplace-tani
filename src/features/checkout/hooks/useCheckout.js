import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutOrders, createSnapToken } from "../api/checkout.api";
import { CART_QUERY_KEY } from "../../cart";

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const payload = {
        namaPenerima: formData.namaPenerima,
        alamatPengiriman: formData.alamatPengiriman,
        ...(formData.noTelepon ? { noTelepon: formData.noTelepon } : {}),
        ...(formData.catatan ? { catatan: formData.catatan } : {}),
      };

      const checkoutResponse = await checkoutOrders(payload);
      const checkoutData = checkoutResponse.data;

      const snapResponse = await createSnapToken(checkoutData.paymentId);
      const snapData = snapResponse.data;

      return {
        ...checkoutData,
        ...snapData,
        orderIds: (checkoutData.orders || []).map((order) => order.id),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },
  });
}
