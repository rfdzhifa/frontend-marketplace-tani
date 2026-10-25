import { Minus, Plus } from 'lucide-react';
import { cn } from '../../../utils/cn';

export function QuantityStepper({
  value,
  min = 1,
  max = 999,
  onChange,
  disabled = false,
  className,
}) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  const handleDecrease = () => {
    if (canDecrease && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (canIncrease && !disabled) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-sm border border-border bg-surface px-3 py-2',
        disabled && 'opacity-50',
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || !canDecrease}
        aria-label="Kurangi jumlah"
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600',
          canDecrease && !disabled
            ? 'text-ink hover:bg-canvas'
            : 'cursor-not-allowed text-ink-muted'
        )}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>

      <span
        className="tabular min-w-[2ch] text-center text-body font-semibold text-ink"
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || !canIncrease}
        aria-label="Tambah jumlah"
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600',
          canIncrease && !disabled
            ? 'text-ink hover:bg-canvas'
            : 'cursor-not-allowed text-ink-muted'
        )}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
