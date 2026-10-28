import { useQuery } from "@tanstack/react-query";
import { getSellerProduct } from "../api/sellerProduct.api";

export function useSellerProduct(id) {
  return useQuery({
    queryKey: ["seller-product", id],
    queryFn: () => getSellerProduct(id),
    enabled: Boolean(id),
    retry: 1,
  });
}

