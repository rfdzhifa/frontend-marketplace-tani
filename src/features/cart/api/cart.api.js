import { httpClient } from "../../../services/httpClient";

/**
 * Fetch current buyer's cart
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function getCart() {
  const response = await httpClient.get("/cart");
  return response.data;
}

/**
 * Add a product to current buyer's cart
 * @param {Object} payload
 * @param {number} payload.productId
 * @param {number} payload.quantity
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function addCartItem({ productId, quantity }) {
  const response = await httpClient.post("/cart/items", { productId, quantity });
  return response.data;
}

/**
 * Update quantity of a cart item
 * @param {number|string} itemId
 * @param {Object} payload
 * @param {number} payload.quantity
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function updateCartItem(itemId, { quantity }) {
  const response = await httpClient.patch(`/cart/items/${itemId}`, { quantity });
  return response.data;
}

/**
 * Remove an item from the cart
 * @param {number|string} itemId
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function removeCartItem(itemId) {
  const response = await httpClient.delete(`/cart/items/${itemId}`);
  return response.data;
}

