import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBuyerOrderDetail, getBuyerOrders } from "../api/checkout.api";
import { ORDER_STATUS } from "../../../constants/orderStatus";

const POLL_INTERVAL_MS = 4000;
const MAX_AUTO_POLLS = 8;

/**
 * Fetch actual order status(es) from backend for payment result verification.
 * @param {Object} params
 * @param {number[]} params.orderIds
 * @param {string} [params.midtransOrderId]
 */
export function usePaymentResult({ orderIds = [], midtransOrderId } = {}) {
  const [pollCount, setPollCount] = useState(0);
  const normalizedIds = orderIds.filter((id) => Number.isInteger(Number(id)) && Number(id) > 0);

  const query = useQuery({
    queryKey: ["checkout-result", normalizedIds.join(","), midtransOrderId || ""],
    queryFn: async () => {
      if (normalizedIds.length > 0) {
        const responses = await Promise.all(
          normalizedIds.map((id) => getBuyerOrderDetail(id)),
        );
        return responses.map((res) => res.data).filter(Boolean);
      }

      const listResponse = await getBuyerOrders({ page: 1, limit: 20 });
      const orders = listResponse.data?.orders || [];

      if (midtransOrderId) {
        const matched = orders.filter(
          (order) => order.payment?.midtransOrderId === midtransOrderId,
        );
        if (matched.length > 0) {
          return matched;
        }
      }

      return orders.slice(0, 1);
    },
    refetchInterval: (queryState) => {
      const orders = queryState.state.data;
      if (!Array.isArray(orders) || orders.length === 0) {
        return false;
      }
      const hasPending = orders.some(
        (order) => order.status === ORDER_STATUS.MENUNGGU_PEMBAYARAN,
      );
      if (!hasPending || pollCount >= MAX_AUTO_POLLS) {
        return false;
      }
      return POLL_INTERVAL_MS;
    },
    retry: 1,
  });

  useEffect(() => {
    if (query.isFetching) {
      return;
    }
    const orders = query.data;
    const hasPending =
      Array.isArray(orders) &&
      orders.some((order) => order.status === ORDER_STATUS.MENUNGGU_PEMBAYARAN);
    if (hasPending && pollCount < MAX_AUTO_POLLS) {
      const timer = setTimeout(() => {
        setPollCount((prev) => prev + 1);
      }, POLL_INTERVAL_MS);
      return () => clearTimeout(timer);
    }
  }, [query.data, query.isFetching, pollCount]);

  const handleManualRefresh = () => {
    setPollCount(0);
    return query.refetch();
  };

  return {
    ...query,
    isAutoPolling:
      Array.isArray(query.data) &&
      query.data.some((order) => order.status === ORDER_STATUS.MENUNGGU_PEMBAYARAN) &&
      pollCount < MAX_AUTO_POLLS,
    refreshStatus: handleManualRefresh,
  };
}
