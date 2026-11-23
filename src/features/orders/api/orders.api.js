import { httpClient } from "../../../services/httpClient";

/**
 * Fetch buyer order history with optional status filter and pagination
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.status]
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function getBuyerOrders({ page = 1, limit = 10, status } = {}) {
  const params = {
    page,
    limit,
    ...(status ? { status } : {}),
  };
  const response = await httpClient.get("/orders", { params });
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
 * Confirm that a shipped order has been received by the buyer
 * @param {number|string} orderId
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function confirmOrderReceived(orderId) {
  const response = await httpClient.patch(`/orders/${orderId}/confirm-received`);
  return response.data;
}
