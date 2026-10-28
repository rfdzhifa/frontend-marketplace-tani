import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSellerProduct } from "../api/sellerProduct.api";

export function useCreateSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createSellerProduct(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response?.message || "Produk berhasil disimpan");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        (error.request
          ? "Tidak dapat terhubung ke server. Periksa koneksi Anda."
          : "Gagal menyimpan produk.");
      toast.error(message);
    },
  });
}

