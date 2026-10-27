export const ROUTES = {
  HOME: "/",
  MARKETPLACE: "/marketplace",
  PRODUCT_DETAIL: "/products/:id",
  FARMER_PROFILE: "/farmers/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  SELLER_DASHBOARD: "/seller/dashboard",
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
