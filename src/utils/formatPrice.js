/**
 * Format number to Indonesian Rupiah
 * @param {number} price - Price in numeric form
 * @returns {string} Formatted price, e.g. "Rp45.000"
 */
export function formatRupiah(price) {
  if (typeof price !== "number" || isNaN(price)) {
    return "Rp0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
