import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSellerProducts } from "../api/sellerProduct.api";

export function useSellerProducts(params = {}) {
  const { status = "all", page = 1, limit = 12 } = params;

  return useQuery({
    queryKey: ["seller-products", { status, page, limit }],
    queryFn: () => getSellerProducts({ status, page, limit }),
    placeholderData: keepPreviousData,
  });
}

