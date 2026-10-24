import { MapPin } from 'lucide-react';
import { ImageWithFallback } from '../../../components/atoms/ImageWithFallback';
import { Badge } from '../../../components/atoms/Badge';
import { RatingStars } from '../../../components/molecules/RatingStars';
import { PriceTag } from '../../../components/molecules/PriceTag';
import { cn } from '../../../utils/cn';
import { MARKETPLACE_CONFIG } from '../config';

export function ProductCard({ product, onClick }) {
  const isOutOfStock = !product.isAvailable;

  const handleClick = () => {
    if (onClick) {
      onClick(product.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'group cursor-pointer overflow-hidden rounded-md border border-border bg-surface transition-all duration-150',
        'hover:border-primary-600 hover:shadow-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
        isOutOfStock && 'opacity-75'
      )}
    >
      <div className="relative">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          aspectRatio={4 / 3}
          className="rounded-t-md"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-surface/60" />
        )}
      </div>

      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 text-body-sm font-semibold text-ink">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <PriceTag price={product.price} unit={product.unit} size="md" />
          {isOutOfStock && <Badge tone="danger">Stok habis</Badge>}
        </div>

        {product.reviewCount > 0 && (
          <RatingStars
            value={product.avgRating}
            count={product.reviewCount}
          />
        )}

        <div className="flex items-start gap-1.5 pt-1">
          <MapPin
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted"
            aria-hidden="true"
          />
          {MARKETPLACE_CONFIG.FARMER_PROFILE_ENABLED ? (
            <a
              href={`/farmers/${product.seller.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-caption text-ink-soft hover:text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:rounded-sm"
            >
              {product.seller.name}
            </a>
          ) : (
            <span className="text-caption text-ink-soft">
              {product.seller.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
