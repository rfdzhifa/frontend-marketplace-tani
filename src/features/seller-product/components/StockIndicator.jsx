import { cn } from "../../../utils/cn";

/**
 * Stock indicator bar and label per design-system.md §6.5
 * @param {Object} props
 * @param {number} props.stock
 * @param {string} [props.className]
 */
export function StockIndicator({ stock, className }) {
  const numStock = typeof stock === "number" ? stock : Number(stock) || 0;

  let colorClass = "bg-primary-600";
  let label = `${numStock} stok`;
  let textClass = "text-ink-soft";
  let percentage = Math.min(100, Math.max(5, (numStock / 50) * 100));

  if (numStock === 0) {
    colorClass = "bg-danger-600";
    label = "Stok habis";
    textClass = "text-danger-600 font-semibold";
    percentage = 100;
  } else if (numStock <= 10) {
    colorClass = "bg-warning-600";
    label = `${numStock} stok · menipis`;
    textClass = "text-warning-600 font-medium";
    percentage = Math.max(10, (numStock / 10) * 30);
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="text-caption flex items-center justify-between">
        <span className={textClass}>{label}</span>
      </div>
      <div className="bg-canvas border-border/50 h-1 w-full overflow-hidden rounded-full border">
        <div
          className={cn("h-full transition-all duration-300", colorClass)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={numStock}
          aria-valuemin={0}
        />
      </div>
    </div>
  );
}
