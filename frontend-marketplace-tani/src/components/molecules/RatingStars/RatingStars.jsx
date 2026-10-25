import { Star } from 'lucide-react';
import { cn } from '../../../utils/cn';

export function RatingStars({ value = 0, count = 0, className }) {
  if (count === 0) {
    return (
      <p className={cn('text-body-sm text-ink-muted', className)}>
        Belum ada rating
      </p>
    );
  }

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(value);
    const half = i === Math.floor(value) && value % 1 >= 0.5;
    return { filled, half };
  });

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {stars.map((star, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              star.filled || star.half
                ? 'fill-star text-star'
                : 'fill-none text-border'
            )}
          />
        ))}
      </div>
      <span className="text-body-sm font-medium text-ink tabular">
        {value.toFixed(1).replace('.', ',')}
      </span>
      <span className="text-caption text-ink-muted">({count} ulasan)</span>
      <span className="sr-only">
        Rating {value} dari 5, berdasarkan {count} ulasan
      </span>
    </div>
  );
}
