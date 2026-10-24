import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { cn } from '../../../utils/cn';

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackIcon: FallbackIcon = Leaf,
  aspectRatio = 4 / 3,
  ...props
}) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const showFallback = !src || error;

  return (
    <div
      className={cn('relative overflow-hidden bg-media-bg', className)}
      style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
    >
      {showFallback ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <FallbackIcon
            className="h-12 w-12 text-ink-muted opacity-40"
            aria-hidden="true"
          />
        </div>
      ) : (
        <>
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-media-bg" />
          )}
          <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            onLoad={() => setLoaded(true)}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-200',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            {...props}
          />
        </>
      )}
    </div>
  );
}
