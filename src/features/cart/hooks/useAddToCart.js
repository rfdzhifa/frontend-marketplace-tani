import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addCartItem } from "../api/cart.api";
import { useAuth } from "../../auth";
import { CART_QUERY_KEY } from "./useCart";

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: (response) => {
      if (user?.id && response?.data) {
        queryClient.setQueryData([CART_QUERY_KEY, user.id], response.data);
      }
      toast.success(response?.message || "Produk berhasil ditambahkan ke keranjang");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Gagal menambahkan produk ke keranjang";
      toast.error(message);
    },
  });
}

