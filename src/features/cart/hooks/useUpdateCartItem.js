import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCartItem } from "../api/cart.api";
import { useAuth } from "../../auth";
import { CART_QUERY_KEY } from "./useCart";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, { quantity }),
    onSuccess: (response) => {
      if (user?.id && response?.data) {
        queryClient.setQueryData([CART_QUERY_KEY, user.id], response.data);
      }
      toast.success(response?.message || "Jumlah produk berhasil diperbarui");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Gagal memperbarui jumlah produk";
      toast.error(message);
    },
  });
}

