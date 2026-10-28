import { httpClient } from "../../../services/httpClient";

/**
 * Fetch seller's own products
 * @param {Object} [params]
 * @param {'all'|'available'|'out_of_stock'} [params.status='all']
 * @param {number} [params.page=1]
 * @param {number} [params.limit=12]
 * @returns {Promise<{ success: boolean, message: string, data: Array, meta: Object }>}
 */
export async function getSellerProducts(params = {}) {
  const { status, page = 1, limit = 12 } = params;
  const query = {};

  if (status && status !== "all") {
    query.status = status;
  }
  if (page) {
    query.page = page;
  }
  if (limit) {
    query.limit = limit;
  }

  const response = await httpClient.get("/seller/products", { params: query });
  return response.data;
}

/**
 * Fetch seller's single product detail
 * @param {number|string} id
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function getSellerProduct(id) {
  const response = await httpClient.get(`/seller/products/${id}`);
  return response.data;
}

/**
 * Create a new seller product
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} [payload.description]
 * @param {number} payload.price
 * @param {string} payload.unit
 * @param {number} payload.stock
 * @param {string|null} [payload.imageUrl]
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function createSellerProduct(payload) {
  const response = await httpClient.post("/seller/products", payload);
  return response.data;
}

/**
 * Update an existing seller product
 * @param {number|string} id
 * @param {Object} payload
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function updateSellerProduct(id, payload) {
  const response = await httpClient.put(`/seller/products/${id}`, payload);
  return response.data;
}

/**
 * Quick stock update for a product
 * @param {number|string} id
 * @param {number} stock
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function updateSellerProductStock(id, stock) {
  const response = await httpClient.patch(`/seller/products/${id}/stock`, {
    stock,
  });
  return response.data;
}

/**
 * Soft delete a seller product
 * @param {number|string} id
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function deleteSellerProduct(id) {
  const response = await httpClient.delete(`/seller/products/${id}`);
  return response.data;
}

