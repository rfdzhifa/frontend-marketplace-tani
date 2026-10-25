import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../api/marketplace.api';

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
    staleTime: 60000, // 1 minute
  });
}
