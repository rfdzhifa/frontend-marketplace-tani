import { Link } from "react-router";
import { MapPin } from "lucide-react";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { Badge } from "../../../components/atoms/Badge";
import { RatingStars } from "../../../components/molecules/RatingStars";
import { PriceTag } from "../../../components/molecules/PriceTag";
import { cn } from "../../../utils/cn";
import { MARKETPLACE_CONFIG } from "../config";
import { getFarmerProfilePath } from "../../../constants/routes";

export function ProductCard({ product, onClick }) {
  const isOutOfStock = !product.isAvailable;

  const handleClick = () => {
    if (onClick) {
      onClick(product.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
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
        "group border-border bg-surface cursor-pointer overflow-hidden rounded-md border transition-all duration-150",
        "hover:border-primary-600 hover:shadow-hover",
        "focus-visible:ring-primary-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        isOutOfStock && "opacity-75",
      )}
    >
      <div className="relative">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          aspectRatio={4 / 3}
          className="rounded-t-md"
        />
        {isOutOfStock && <div className="bg-surface/60 absolute inset-0" />}
      </div>

      <div className="space-y-2 p-3">
        <h3 className="text-body-sm text-ink line-clamp-2 font-semibold">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <PriceTag price={product.price} unit={product.unit} size="md" />
          {isOutOfStock && <Badge tone="danger">Stok habis</Badge>}
        </div>

        <RatingStars value={product.avgRating} count={product.reviewCount} />

        <div className="flex items-start gap-1.5 pt-1">
          <MapPin
            className="text-ink-muted mt-0.5 h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          {MARKETPLACE_CONFIG.FARMER_PROFILE_ENABLED ? (
            <Link
              to={getFarmerProfilePath(product.seller.id)}
              onClick={(e) => e.stopPropagation()}
              className="text-caption text-ink-soft hover:text-primary-600 focus-visible:ring-primary-600 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              {product.seller.name}
            </Link>
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
