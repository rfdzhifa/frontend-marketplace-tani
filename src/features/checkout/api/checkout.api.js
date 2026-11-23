import { httpClient } from "../../../services/httpClient";

/**
 * Create order(s) from current buyer's cart
 * @param {Object} payload
 * @param {string} payload.namaPenerima
 * @param {string} [payload.noTelepon]
 * @param {string} payload.alamatPengiriman
 * @param {string} [payload.catatan]
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function checkoutOrders(payload) {
  const response = await httpClient.post("/orders/checkout", payload);
  return response.data;
}

/**
 * Create or retrieve Midtrans Snap token for a payment
 * @param {number|string} paymentId
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function createSnapToken(paymentId) {
  const response = await httpClient.post(`/payments/${paymentId}/snap-token`);
  return response.data;
}

/**
 * Fetch buyer order detail by ID
 * @param {number|string} orderId
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function getBuyerOrderDetail(orderId) {
  const response = await httpClient.get(`/orders/${orderId}`);
  return response.data;
}

/**
 * Fetch buyer order list
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.status]
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function getBuyerOrders(params = {}) {
  const response = await httpClient.get("/orders", { params });
  return response.data;
}
