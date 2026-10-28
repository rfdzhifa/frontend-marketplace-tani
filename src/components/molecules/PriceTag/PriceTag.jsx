import { cn } from "../../../utils/cn";
import { formatRupiah } from "../../../utils/formatPrice";

export function PriceTag({ price, unit, className, size = "md" }) {
  const sizeClasses = {
    sm: "text-body-sm",
    md: "text-body-sm",
    lg: "text-body",
  };

  return (
    <div className={cn("flex items-baseline gap-0.5", className)}>
      <span className={cn("text-ink tabular font-bold", sizeClasses[size])}>
        {formatRupiah(price)}
      </span>
      {unit && <span className="text-body-sm text-ink-soft">/{unit}</span>}
    </div>
  );
}
