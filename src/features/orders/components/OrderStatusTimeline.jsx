import { CheckCircle2, Clock } from "lucide-react";
import { ORDER_STATUS, ORDER_STATUS_LABELS } from "../../../constants/orderStatus";
import { formatDateTime } from "../../../utils/formatDate";
import { cn } from "../../../utils/cn";

export function OrderStatusTimeline({ statusHistory = [] }) {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <p className="text-body-sm text-ink-muted">
        Belum ada riwayat perubahan status.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {statusHistory.map((entry, index) => {
        const isLatest = index === statusHistory.length - 1;
        const isCancelled = entry.status === ORDER_STATUS.DIBATALKAN;

        return (
          <li key={entry.id || `${entry.status}-${index}`} className="relative flex gap-3.5">
            {index < statusHistory.length - 1 && (
              <span
                className="bg-border absolute top-7 left-3.5 h-[calc(100%-8px)] w-px"
                aria-hidden="true"
              />
            )}

            <span
              className={cn(
                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                isCancelled
                  ? "border-danger-600/30 bg-danger-50 text-danger-600"
                  : isLatest
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-primary-600/30 bg-primary-50 text-primary-700",
              )}
            >
              {isLatest ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </span>

            <div className="min-w-0 flex-1 pb-1">
              <p
                className={cn(
                  "text-body-sm font-semibold",
                  isCancelled ? "text-danger-600" : "text-ink",
                )}
              >
                {ORDER_STATUS_LABELS[entry.status] || entry.status}
              </p>
              <p className="text-caption text-ink-muted tabular">
                {formatDateTime(entry.waktuPerubahan)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
