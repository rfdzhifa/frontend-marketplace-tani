import { useState } from 'react';
import { MapPin, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../../components/atoms/Badge';
import { Button } from '../../../components/atoms/Button';
import { RatingStars } from '../../../components/molecules/RatingStars';
import { PriceTag } from '../../../components/molecules/PriceTag';
import { QuantityStepper } from './QuantityStepper';
import { MARKETPLACE_CONFIG } from '../config';
import { ROLES } from '../../../constants/roles';

export function ProductDetailInfo({
  product,
  isAuthenticated = false,
  userRole = null,
  onAddToCart,
}) {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = !product.isAvailable;
  const isSeller = userRole === ROLES.SELLER;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ productId: product.id, quantity });
    } else {
      // Temporary fallback until Cart module is implemented
      toast.info('Fitur keranjang segera hadir');
    }
  };

  const getButtonState = () => {
    if (isOutOfStock) {
      return {
        disabled: true,
        label: 'Stok habis',
        helpText: null,
      };
    }

    if (!isAuthenticated) {
      return {
        disabled: false,
        label: 'Tambah ke keranjang',
        helpText: 'Anda akan diarahkan ke halaman login',
      };
    }

    if (isSeller) {
      return {
        disabled: true,
        label: 'Tidak tersedia',
        helpText: 'Hanya akun pembeli yang dapat membeli produk',
      };
    }

    return {
      disabled: false,
      label: 'Tambah ke keranjang',
      helpText: null,
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="space-y-6">
      {/* Title and Stock Status */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-h3 font-semibold text-ink lg:text-h2">
            {product.name}
          </h1>
          {isOutOfStock && <Badge tone="danger">Stok habis</Badge>}
        </div>

        {/* Seller Info */}
        <div className="mt-3 flex items-center gap-1.5">
          <MapPin
            className="h-4 w-4 shrink-0 text-ink-muted"
            aria-hidden="true"
          />
          {MARKETPLACE_CONFIG.FARMER_PROFILE_ENABLED ? (
            <a
              href={`/farmers/${product.seller.id}`}
              className="text-body-sm text-ink-soft hover:text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:rounded-sm"
            >
              {product.seller.name}
            </a>
          ) : (
            <span className="text-body-sm text-ink-soft">
              {product.seller.name}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <PriceTag price={product.price} unit={product.unit} size="lg" />

      {/* Rating */}
      <div>
        {product.reviewCount > 0 ? (
          <RatingStars value={product.avgRating} count={product.reviewCount} />
        ) : (
          <p className="text-body-sm text-ink-muted">Belum ada rating</p>
        )}
      </div>

      {/* Stock Info */}
      <div className="rounded-md border border-border bg-canvas p-4">
        <p className="text-body-sm text-ink-soft">
          Stok tersedia:{' '}
          <span className="font-semibold text-ink">
            {product.stock} {product.unit}
          </span>
        </p>
      </div>

      {/* Quantity Stepper and Add to Cart */}
      {!isOutOfStock && (
        <div className="space-y-3">
          <div>
            <label htmlFor="quantity" className="text-body-sm font-medium text-ink-soft mb-2 block">
              Jumlah
            </label>
            <QuantityStepper
              id="quantity"
              value={quantity}
              min={1}
              max={product.stock}
              onChange={setQuantity}
              disabled={isOutOfStock}
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            disabled={buttonState.disabled}
            className="w-full sm:w-auto"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {buttonState.label}
          </Button>

          {buttonState.helpText && (
            <p className="text-caption text-ink-muted">{buttonState.helpText}</p>
          )}
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="border-t border-border pt-6">
          <h2 className="text-h4 font-semibold text-ink mb-3">Deskripsi</h2>
          <p className="text-body text-ink-soft whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      {/* Reviews Placeholder */}
      <div className="border-t border-border pt-6">
        <h2 className="text-h4 font-semibold text-ink mb-3">Ulasan</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div>{/* Reviews list will be implemented in Review module */}</div>
        ) : (
          <p className="text-body-sm text-ink-muted">Belum ada ulasan.</p>
        )}
      </div>
    </div>
  );
}
