import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSellerProduct } from "../api/sellerProduct.api";

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteSellerProduct(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({
        queryKey: ["seller-product", String(id)],
      });
      queryClient.invalidateQueries({
        queryKey: ["seller-product", Number(id)],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", String(id)],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", Number(id)],
      });
      toast.success(response?.message || "Produk berhasil dihapus");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        (error.request
          ? "Tidak dapat terhubung ke server. Periksa koneksi Anda."
          : "Gagal menghapus produk.");
      toast.error(message);
    },
  });
}

