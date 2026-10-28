import { Link } from "react-router";
import { Edit2, PackageOpen, Trash2 } from "lucide-react";
import { Badge } from "../../../components/atoms/Badge";
import { Button } from "../../../components/atoms/Button";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { PriceTag } from "../../../components/molecules/PriceTag";
import { StockIndicator } from "./StockIndicator";
import { getSellerProductEditPath } from "../../../constants/routes";
import { cn } from "../../../utils/cn";

export function SellerProductCard({ product, onOpenStock, onOpenDelete }) {
  const isOutOfStock = !product.isAvailable || product.stock === 0;

  return (
    <div
      className={cn(
        "group border-border bg-surface hover:shadow-hover flex flex-col justify-between overflow-hidden rounded-md border transition-all duration-150",
        isOutOfStock && "bg-canvas/40",
      )}
    >
      <div>
        {/* Photo with status badge */}
        <div className="relative">
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            aspectRatio={4 / 3}
            className="rounded-t-md"
          />
          <div className="absolute top-2.5 right-2.5">
            {isOutOfStock ? (
              <Badge tone="danger">Stok habis</Badge>
            ) : (
              <Badge tone="success">Tersedia</Badge>
            )}
          </div>
          {isOutOfStock && <div className="bg-surface/50 absolute inset-0" />}
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          <div>
            <h3 className="text-body-sm text-ink title-case line-clamp-2 font-semibold">
              {product.name}
            </h3>
            <div className="mt-1">
              <PriceTag price={product.price} unit={product.unit} size="md" />
            </div>
          </div>

          <StockIndicator stock={product.stock} />
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-border bg-canvas/30 flex items-center justify-between gap-1.5 border-t p-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="text-caption h-8 flex-1 gap-1 px-2"
          onClick={() => onOpenStock(product)}
        >
          <PackageOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Ubah Stok</span>
        </Button>

        <Link to={getSellerProductEditPath(product.id)}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label={`Ubah info ${product.name}`}
          >
            <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-danger-600 hover:bg-danger-50 hover:text-danger-700 h-8 w-8 p-0"
          aria-label={`Hapus ${product.name}`}
          onClick={() => onOpenDelete(product)}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
