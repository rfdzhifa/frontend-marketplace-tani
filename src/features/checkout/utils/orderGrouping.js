export const FLAT_SHIPPING_FEE_PER_SELLER = 10000;

/**
 * Group cart items by seller and calculate flat shipping fee per seller.
 * @param {Array} items
 */
export function groupCartItemsBySeller(items = []) {
  const groupsMap = new Map();

  for (const item of items) {
    const sellerId = item.seller?.id ?? `seller-${item.seller?.name || "unknown"}`;
    const sellerName = item.seller?.name || "Petani Lokal";

    if (!groupsMap.has(sellerId)) {
      groupsMap.set(sellerId, {
        sellerId,
        sellerName,
        items: [],
        itemsSubtotal: 0,
        shippingFee: FLAT_SHIPPING_FEE_PER_SELLER,
      });
    }

    const group = groupsMap.get(sellerId);
    group.items.push(item);
    group.itemsSubtotal += Number(item.subtotal || item.price * item.quantity || 0);
  }

  const groups = Array.from(groupsMap.values()).map((group) => ({
    ...group,
    orderTotal: group.itemsSubtotal + group.shippingFee,
  }));

  const itemsSubtotal = groups.reduce((sum, g) => sum + g.itemsSubtotal, 0);
  const totalShipping = groups.reduce((sum, g) => sum + g.shippingFee, 0);
  const grandTotal = itemsSubtotal + totalShipping;

  return {
    groups,
    itemsSubtotal,
    totalShipping,
    grandTotal,
  };
}
