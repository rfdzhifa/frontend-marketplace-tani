import { cn } from '../../../utils/cn';

export function Skeleton({ className, aspectRatio, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-media-bg',
        aspectRatio && 'relative overflow-hidden',
        className
      )}
      role="status"
      aria-label="Memuat..."
      {...props}
    >
      {aspectRatio && (
        <div style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }} />
      )}
    </div>
  );
}
