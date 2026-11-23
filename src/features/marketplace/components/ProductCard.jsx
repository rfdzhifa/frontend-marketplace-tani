import { useNavigate, Link } from "react-router";
import { MapPin, Plus, Star } from "lucide-react";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { Badge } from "../../../components/atoms/Badge";
import { Spinner } from "../../../components/atoms/Spinner";
import { PriceTag } from "../../../components/molecules/PriceTag";
import { cn } from "../../../utils/cn";
import { MARKETPLACE_CONFIG } from "../config";
import { getFarmerProfilePath } from "../../../constants/routes";
import { useAddToCart } from "../../cart";
import { useAuth } from "../../auth";

export function ProductCard({ product, onClick }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const addToCartMutation = useAddToCart();

  const isOutOfStock = !product.isAvailable;

  const handleClick = () => {
    if (onClick) {
      onClick(product.id);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.target !== e.currentTarget &&
      (e.target.tagName === "BUTTON" || e.target.tagName === "A")
    ) {
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock || addToCartMutation.isPending) return;

    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${product.id}`);
      return;
    }

    addToCartMutation.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-200 cursor-pointer",
        "hover:-translate-y-0.5 hover:border-primary-600 hover:shadow-card",
        "focus-visible:ring-primary-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        isOutOfStock && "opacity-80",
      )}
    >
      <div className="relative overflow-hidden bg-[#F4F6F4] rounded-t-2xl">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          aspectRatio={1}
          className="rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && <div className="bg-surface/60 absolute inset-0" />}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {isOutOfStock && <Badge tone="danger">Stok habis</Badge>}
          {!isOutOfStock && (product.badge || product.highlight) && (
            <Badge tone="success">{product.badge || product.highlight}</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 gap-2.5">
        <div className="space-y-1.5">
          <h3 className="text-body-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-primary-700 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 text-caption text-ink-muted">
            <MapPin
              className="h-3.5 w-3.5 shrink-0 text-ink-muted"
              aria-hidden="true"
            />
            {MARKETPLACE_CONFIG.FARMER_PROFILE_ENABLED && product.seller?.id ? (
              <Link
                to={getFarmerProfilePath(product.seller.id)}
                onClick={(e) => e.stopPropagation()}
                className="truncate hover:text-primary-600 hover:underline focus-visible:ring-primary-600 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                {product.seller.name}
              </Link>
            ) : (
              <span className="truncate">
                {product.seller?.name || "Petani Lokal"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-caption font-medium pt-0.5">
            <Star
              className={cn(
                "h-3.5 w-3.5 shrink-0",
                (product.reviewCount ?? 0) > 0
                  ? "fill-star text-star"
                  : "text-border fill-none",
              )}
              aria-hidden="true"
            />
            <span className="font-semibold text-ink tabular">
              {Number(product.avgRating || 0).toFixed(1)}
            </span>
            <span className="text-ink-muted tabular">
              ({product.reviewCount ?? 0})
            </span>
            <span className="sr-only">
              Rating {product.avgRating || 0} dari 5, berdasarkan {product.reviewCount ?? 0} ulasan
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <PriceTag price={product.price} unit={product.unit} size="md" />

          <button
            type="button"
            disabled={isOutOfStock || addToCartMutation.isPending}
            onClick={handleQuickAdd}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-all duration-150 ease-out",
              "hover:bg-primary-700 active:scale-95 shadow-sm cursor-pointer",
              "focus-visible:ring-primary-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              "disabled:pointer-events-none disabled:opacity-40 disabled:bg-ink-muted",
            )}
          >
            {addToCartMutation.isPending ? (
              <Spinner className="h-4 w-4 text-white" />
            ) : (
              <Plus className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
