import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateSellerProduct } from "../api/sellerProduct.api";

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateSellerProduct(id, payload),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({
        queryKey: ["seller-product", String(variables.id)],
      });
      queryClient.invalidateQueries({
        queryKey: ["seller-product", Number(variables.id)],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", String(variables.id)],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", Number(variables.id)],
      });
      toast.success(response?.message || "Produk berhasil diperbarui");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        (error.request
          ? "Tidak dapat terhubung ke server. Periksa koneksi Anda."
          : "Gagal memperbarui produk.");
      toast.error(message);
    },
  });
}

