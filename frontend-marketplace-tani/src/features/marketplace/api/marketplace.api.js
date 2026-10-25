import { httpClient } from '../../../services/httpClient';

/**
 * Fetch paginated product list with optional search
 * @param {Object} params
 * @param {string} [params.search] - Search keyword
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=12] - Items per page
 * @returns {Promise<{success: boolean, message: string, data: Array, meta: Object}>}
 */
export async function getProducts({ search = '', page = 1, limit = 12 } = {}) {
  const params = new URLSearchParams();
  
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  params.append('page', String(page));
  params.append('limit', String(limit));
  
  const response = await httpClient.get(`/products?${params.toString()}`);
  return response.data;
}

/**
 * Fetch single product detail by ID
 * @param {number|string} id - Product ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export async function getProductById(id) {
  const response = await httpClient.get(`/products/${id}`);
  return response.data;
}
