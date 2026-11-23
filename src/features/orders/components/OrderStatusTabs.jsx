import { ORDER_STATUS, ORDER_STATUS_LABELS } from "../../../constants/orderStatus";
import { cn } from "../../../utils/cn";

const FILTER_OPTIONS = [
  { key: "", label: "Semua" },
  {
    key: ORDER_STATUS.MENUNGGU_PEMBAYARAN,
    label: ORDER_STATUS_LABELS[ORDER_STATUS.MENUNGGU_PEMBAYARAN],
  },
  { key: ORDER_STATUS.DIBAYAR, label: ORDER_STATUS_LABELS[ORDER_STATUS.DIBAYAR] },
  { key: ORDER_STATUS.DIPROSES, label: ORDER_STATUS_LABELS[ORDER_STATUS.DIPROSES] },
  { key: ORDER_STATUS.DIKIRIM, label: ORDER_STATUS_LABELS[ORDER_STATUS.DIKIRIM] },
  { key: ORDER_STATUS.SELESAI, label: ORDER_STATUS_LABELS[ORDER_STATUS.SELESAI] },
  {
    key: ORDER_STATUS.DIBATALKAN,
    label: ORDER_STATUS_LABELS[ORDER_STATUS.DIBATALKAN],
  },
];

export function OrderStatusTabs({ activeStatus = "", onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter status pesanan"
      className="flex flex-wrap items-center gap-2"
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = (activeStatus || "") === option.key;
        return (
          <button
            key={option.key || "ALL"}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.key)}
            className={cn(
              "inline-flex h-9 items-center rounded-full border px-4 text-body-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none cursor-pointer",
              isActive
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-border bg-surface text-ink-soft hover:bg-canvas hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
