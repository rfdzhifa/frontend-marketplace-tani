import { Store, Truck } from "lucide-react";
import { Button } from "../../../components/atoms/Button";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { formatRupiah } from "../../marketplace";
import { groupCartItemsBySeller } from "../utils/orderGrouping";

export function CheckoutOrderSummary({
  cart,
  formId = "checkout-form",
  isSubmitting = false,
  hasPendingPayment = false,
  onResumePayment,
  onViewOrderStatus,
}) {
  const { groups, itemsSubtotal, totalShipping, grandTotal } = groupCartItemsBySeller(
    cart?.items || [],
  );

  return (
    <div className="space-y-4">
      {/* Multi-seller breakdown */}
      <div className="border-border bg-surface rounded-2xl border p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-border border-b pb-3">
          <h2 className="text-h4 font-semibold text-ink">Ringkasan Pesanan</h2>
          <span className="text-caption text-ink-muted font-medium">
            {groups.length} petani · {cart?.totalItems || 0} item
          </span>
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.sellerId}
              className="border-border bg-canvas/50 rounded-xl border p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-body-sm font-semibold text-ink">
                <Store className="h-4 w-4 text-primary-600 shrink-0" aria-hidden="true" />
                <span>{group.sellerName}</span>
              </div>

              <div className="space-y-2.5">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-media-bg">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.name}
                        aspectRatio={1}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-medium text-ink line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-caption text-ink-muted tabular">
                        {item.quantity} {item.unit} × {formatRupiah(item.price)}
                      </p>
                    </div>
                    <p className="text-body-sm font-semibold text-ink tabular shrink-0">
                      {formatRupiah(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-border border-t pt-2.5 flex items-center justify-between text-caption text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                  Ongkos kirim flat petani
                </span>
                <span className="font-medium text-ink tabular">
                  {formatRupiah(group.shippingFee)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-border border-t pt-4 space-y-2 text-body-sm">
          <div className="flex items-center justify-between text-ink-soft">
            <span>Subtotal Produk</span>
            <span className="tabular font-medium text-ink">
              {formatRupiah(itemsSubtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-ink-soft">
            <span>Total Ongkos Kirim ({groups.length} petani)</span>
            <span className="tabular font-medium text-ink">
              {formatRupiah(totalShipping)}
            </span>
          </div>
          <div className="flex items-baseline justify-between border-border border-t pt-3">
            <span className="text-body font-semibold text-ink">Total Pembayaran</span>
            <span className="text-h3 font-bold text-primary-600 tabular">
              {formatRupiah(grandTotal)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        {hasPendingPayment ? (
          <div className="space-y-2.5 pt-1">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onResumePayment}
              className="w-full"
            >
              Lanjutkan Pembayaran
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onViewOrderStatus}
              className="w-full"
            >
              Lihat Status Pesanan
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            form={formId}
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
          >
            Bayar Sekarang
          </Button>
        )}
      </div>
    </div>
  );
}
