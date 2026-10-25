export const ROUTES = {
  HOME: "/",
  MARKETPLACE: "/marketplace",
  PRODUCT_DETAIL: "/products/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  SELLER_DASHBOARD: "/seller/dashboard",
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
