import { Link } from "react-router";
import { Trash2 } from "lucide-react";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { Badge } from "../../../components/atoms/Badge";
import { QuantityStepper } from "../../../components/molecules/QuantityStepper";
import { formatRupiah } from "../../marketplace";
import { getProductDetailPath, getFarmerProfilePath } from "../../../constants/routes";

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}) {
  const isOutOfStock = !item.isAvailable || item.stock === 0;
  const isExceedingStock = item.quantity > item.stock && !isOutOfStock;
  const isBusy = isUpdating || isRemoving;

  return (
    <div className="border-border bg-surface flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      {/* Product Image & Info */}
      <div className="flex items-start gap-4 flex-1">
        <Link
          to={getProductDetailPath(item.productId)}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          <ImageWithFallback
            src={item.imageUrl}
            alt={item.name}
            aspectRatio={1}
            className="h-full w-full object-cover"
          />
        </Link>

        <div className="space-y-1.5 flex-1 min-w-0">
          <Link
            to={getProductDetailPath(item.productId)}
            className="text-body-sm sm:text-body font-semibold text-ink hover:text-primary-600 line-clamp-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:rounded-sm"
          >
            {item.name}
          </Link>

          {item.seller?.name && (
            <p className="text-caption text-ink-muted">
              Petani:{" "}
              {item.seller.id ? (
                <Link
                  to={getFarmerProfilePath(item.seller.id)}
                  className="text-ink-soft hover:text-primary-600 hover:underline"
                >
                  {item.seller.name}
                </Link>
              ) : (
                <span>{item.seller.name}</span>
              )}
            </p>
          )}

          <p className="text-body-sm text-ink-soft">
            <span className="tabular font-medium">{formatRupiah(item.price)}</span>
            <span className="text-ink-muted"> / {item.unit}</span>
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {isOutOfStock && <Badge tone="danger">Stok habis</Badge>}
            {isExceedingStock && (
              <Badge tone="warning">Stok tersisa {item.stock}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stepper, Subtotal & Actions */}
      <div className="border-border flex flex-wrap items-center justify-between gap-4 border-t pt-3 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end sm:justify-center">
        <div className="flex items-center gap-3">
          <QuantityStepper
            value={item.quantity}
            min={1}
            max={Math.max(1, item.stock)}
            disabled={isBusy || isOutOfStock}
            onChange={(newQty) => onUpdateQuantity(item.id, newQty)}
          />

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={isBusy}
            aria-label={`Hapus ${item.name} dari keranjang`}
            className="text-ink-muted hover:text-danger-600 focus-visible:ring-danger-600 flex h-9 w-9 items-center justify-center rounded-sm transition-colors hover:bg-danger-50 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="text-right">
          <p className="text-caption text-ink-muted sm:hidden">Subtotal</p>
          <p className="text-body font-semibold text-ink tabular">
            {formatRupiah(item.subtotal)}
          </p>
        </div>
      </div>
    </div>
  );
}

