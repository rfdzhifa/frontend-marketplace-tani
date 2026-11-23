import { Link } from "react-router";
import { ChevronRight, Store } from "lucide-react";
import { Button } from "../../../components/atoms/Button";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { getOrderDetailPath } from "../../../constants/routes";
import { formatDate } from "../../../utils/formatDate";
import { formatRupiah } from "../../marketplace";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderCard({ order }) {
  const firstItem = order.items?.[0];
  const extraItemsCount = Math.max(0, (order.items?.length || order.itemsCount || 1) - 1);
  const sellerName = order.seller?.namaUsaha || order.seller?.name || "Petani Lokal";

  return (
    <article className="border-border bg-surface hover:shadow-hover rounded-2xl border p-4 sm:p-5 transition-shadow duration-150 space-y-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-border border-b pb-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-body-sm font-semibold text-ink tabular">
            {order.nomorOrder}
          </span>
          <span className="text-caption text-ink-muted">
            {formatDate(order.tanggalOrder)}
          </span>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      {/* Seller + Product preview */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {firstItem && (
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-media-bg">
              <ImageWithFallback
                src={firstItem.gambarUrl}
                alt={firstItem.nama || "Produk pesanan"}
                aspectRatio={1}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 text-caption font-medium text-ink-soft">
              <Store className="h-3.5 w-3.5 text-primary-600 shrink-0" aria-hidden="true" />
              <span className="truncate">{sellerName}</span>
            </div>

            {firstItem ? (
              <p className="text-body-sm font-semibold text-ink line-clamp-1">
                {firstItem.nama}
              </p>
            ) : (
              <p className="text-body-sm font-semibold text-ink">
                {order.itemsCount || 0} jenis produk
              </p>
            )}

            <p className="text-caption text-ink-muted tabular">
              {firstItem
                ? `${firstItem.jumlah} ${firstItem.satuan || "unit"}`
                : `${order.itemsCount || 0} item`}
              {extraItemsCount > 0 && ` · +${extraItemsCount} produk lainnya`}
            </p>
          </div>
        </div>

        {/* Total & Action */}
        <div className="flex items-center justify-between gap-4 border-border border-t pt-3 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end">
          <div className="sm:text-right">
            <p className="text-caption text-ink-muted">Total Belanja</p>
            <p className="text-body font-bold text-primary-600 tabular">
              {formatRupiah(order.totalHarga)}
            </p>
          </div>

          <Link to={getOrderDetailPath(order.id)}>
            <Button variant="secondary" size="sm">
              <span>Lihat Detail</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
