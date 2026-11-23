export const ROUTES = {
  HOME: "/",
  MARKETPLACE: "/marketplace",
  PRODUCT_DETAIL: "/products/:id",
  FARMER_PROFILE: "/farmers/:id",
  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_RESULT: "/checkout/result",
  CHECKOUT_RESULT_DETAIL: "/checkout/result/:orderId",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/:orderId",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  SELLER_DASHBOARD: "/seller/dashboard",
  SELLER_PRODUCTS: "/seller/products",
  SELLER_PRODUCT_NEW: "/seller/products/new",
  SELLER_PRODUCT_EDIT: "/seller/products/:productId/edit",
  SELLER_FARM_PROFILE: "/seller/farm-profile",
  FORBIDDEN: "/forbidden",
};

/**
 * Helper to build product detail route
 * @param {number|string} productId
 * @returns {string}
 */
export function getProductDetailPath(productId) {
  return `/products/${productId}`;
}

/**
 * Helper to build farmer profile route
 * @param {number|string} farmerId
 * @returns {string}
 */
export function getFarmerProfilePath(farmerId) {
  return `/farmers/${farmerId}`;
}

/**
 * Helper to build seller product edit route
 * @param {number|string} productId
 * @returns {string}
 */
export function getSellerProductEditPath(productId) {
  return `/seller/products/${productId}/edit`;
}

/**
 * Helper to build checkout result route
 * @param {number|string} [orderId]
 * @returns {string}
 */
export function getCheckoutResultPath(orderId) {
  return orderId ? `/checkout/result/${orderId}` : "/checkout/result";
}

/**
 * Helper to build buyer order detail route
 * @param {number|string} orderId
 * @returns {string}
 */
export function getOrderDetailPath(orderId) {
  return `/orders/${orderId}`;
}
