import { cn } from '../../../utils/cn';
import { formatRupiah } from '../../../features/marketplace/utils/formatPrice';

export function PriceTag({ price, unit, className, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-body-sm',
    md: 'text-body-sm',
    lg: 'text-body',
  };

  return (
    <div className={cn('flex items-baseline gap-0.5', className)}>
      <span
        className={cn(
          'font-bold text-ink tabular',
          sizeClasses[size]
        )}
      >
        {formatRupiah(price)}
      </span>
      {unit && (
        <span className="text-body-sm text-ink-soft">/{unit}</span>
      )}
    </div>
  );
}
