import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/marketplace.api';

export function useProducts({ search = '', page = 1, limit = 12 } = {}) {
  return useQuery({
    queryKey: ['products', { search, page, limit }],
    queryFn: () => getProducts({ search, page, limit }),
    placeholderData: (previousData) => previousData,
    staleTime: 30000, // 30 seconds
  });
}
