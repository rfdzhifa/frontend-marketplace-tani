import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeCartItem } from "../api/cart.api";
import { useAuth } from "../../auth";
import { CART_QUERY_KEY } from "./useCart";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (itemId) => removeCartItem(itemId),
    onSuccess: (response) => {
      if (user?.id && response?.data) {
        queryClient.setQueryData([CART_QUERY_KEY, user.id], response.data);
      }
      toast.success(response?.message || "Produk berhasil dihapus dari keranjang");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Gagal menghapus produk dari keranjang";
      toast.error(message);
    },
  });
}

