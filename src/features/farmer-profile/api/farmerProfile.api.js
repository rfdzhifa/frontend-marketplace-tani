import { httpClient } from "../../../services/httpClient";

/**
 * Fetch public farmer profile and their active products by seller user ID
 * @param {number|string} id - Seller user ID
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function getFarmerProfile(id) {
  const response = await httpClient.get(`/farmers/${id}`);
  return response.data;
}

/**
 * Fetch logged-in seller's farmer profile
 * @returns {Promise<{ success: boolean, message: string, data: Object|null }>}
 */
export async function getMyFarmerProfile() {
  const response = await httpClient.get("/seller/farmer-profile");
  return response.data;
}

/**
 * Create or update logged-in seller's farmer profile
 * @param {Object} payload
 * @param {string} payload.farmName
 * @param {string} payload.description
 * @param {string} payload.location
 * @param {string} [payload.photoUrl]
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function saveFarmerProfile(payload) {
  const response = await httpClient.put("/seller/farmer-profile", {
    farmName: payload.farmName.trim(),
    description: payload.description.trim(),
    location: payload.location.trim(),
    photoUrl:
      payload.photoUrl && payload.photoUrl.trim()
        ? payload.photoUrl.trim()
        : null,
  });
  return response.data;
}
