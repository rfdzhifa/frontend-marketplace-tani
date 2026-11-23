import { ORDER_STATUS, ORDER_STATUS_LABELS } from "../../../constants/orderStatus";
import { cn } from "../../../utils/cn";

const STATUS_STYLES = {
  [ORDER_STATUS.MENUNGGU_PEMBAYARAN]: {
    pill: "bg-status-pending-bg text-status-pending-fg",
    dot: "bg-status-pending-fg",
  },
  [ORDER_STATUS.DIBAYAR]: {
    pill: "bg-status-paid-bg text-status-paid-fg",
    dot: "bg-status-paid-fg",
  },
  [ORDER_STATUS.DIPROSES]: {
    pill: "bg-status-processing-bg text-status-processing-fg",
    dot: "bg-status-processing-fg",
  },
  [ORDER_STATUS.DIKIRIM]: {
    pill: "bg-status-shipped-bg text-status-shipped-fg",
    dot: "bg-status-shipped-fg",
  },
  [ORDER_STATUS.SELESAI]: {
    pill: "bg-status-completed-bg text-status-completed-fg",
    dot: "bg-status-completed-fg",
  },
  [ORDER_STATUS.DIBATALKAN]: {
    pill: "bg-status-cancelled-bg text-status-cancelled-fg",
    dot: "bg-status-cancelled-fg",
  },
};

export function OrderStatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] || {
    pill: "bg-canvas text-ink-soft",
    dot: "bg-ink-muted",
  };
  const label = ORDER_STATUS_LABELS[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium whitespace-nowrap",
        style.pill,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", style.dot)} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
