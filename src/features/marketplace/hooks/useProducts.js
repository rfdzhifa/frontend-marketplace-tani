import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/marketplace.api';

export function useProducts({ search = '', category = '', page = 1, limit = 12 } = {}) {
  return useQuery({
    queryKey: ['products', { search, category, page, limit }],
    queryFn: () => getProducts({ search, category, page, limit }),
    placeholderData: (previousData) => previousData,
    staleTime: 30000, // 30 seconds
  });
}
