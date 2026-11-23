import { Link } from "react-router";
import { CheckCircle2, Clock, RefreshCw, XCircle } from "lucide-react";
import { Badge } from "../../../components/atoms/Badge";
import { Button } from "../../../components/atoms/Button";
import { ORDER_STATUS, ORDER_STATUS_LABELS } from "../../../constants/orderStatus";
import { getOrderDetailPath, ROUTES } from "../../../constants/routes";
import { formatRupiah } from "../../marketplace";

function getStatusBadgeTone(status) {
  switch (status) {
    case ORDER_STATUS.DIBAYAR:
    case ORDER_STATUS.SELESAI:
      return "primary";
    case ORDER_STATUS.MENUNGGU_PEMBAYARAN:
      return "warning";
    case ORDER_STATUS.DIBATALKAN:
      return "danger";
    default:
      return "neutral";
  }
}

function getAggregatePaymentState(orders = []) {
  if (orders.some((o) => o.status === ORDER_STATUS.DIBATALKAN)) {
    return ORDER_STATUS.DIBATALKAN;
  }
  if (orders.some((o) => o.status === ORDER_STATUS.MENUNGGU_PEMBAYARAN)) {
    return ORDER_STATUS.MENUNGGU_PEMBAYARAN;
  }
  return ORDER_STATUS.DIBAYAR;
}

export function PaymentResultCard({
  orders = [],
  isAutoPolling = false,
  isRefreshing = false,
  onRefresh,
}) {
  const aggregateStatus = getAggregatePaymentState(orders);
  const grandTotal = orders.reduce((sum, order) => sum + Number(order.totalHarga || 0), 0);

  const statusConfig = {
    [ORDER_STATUS.DIBAYAR]: {
      icon: CheckCircle2,
      iconWrapperClass: "bg-primary-100 text-primary-700",
      title: "Pembayaran Berhasil Dikonfirmasi",
      description:
        "Terima kasih! Pembayaran Anda telah diverifikasi oleh sistem. Petani akan segera memproses pesanan Anda.",
    },
    [ORDER_STATUS.MENUNGGU_PEMBAYARAN]: {
      icon: Clock,
      iconWrapperClass: "bg-warning-50 text-warning-600",
      title: "Menunggu Konfirmasi Pembayaran",
      description:
        "Pembayaran Anda sedang diproses atau belum diselesaikan. Status pesanan akan diperbarui otomatis setelah konfirmasi Midtrans diterima.",
    },
    [ORDER_STATUS.DIBATALKAN]: {
      icon: XCircle,
      iconWrapperClass: "bg-danger-50 text-danger-600",
      title: "Pembayaran Dibatalkan atau Kedaluwarsa",
      description:
        "Pembayaran tidak berhasil diselesaikan sehingga pesanan dibatalkan. Stok produk tidak dikurangi dan Anda dapat melakukan checkout ulang dari keranjang.",
    },
  }[aggregateStatus];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Main Status Card */}
      <div className="border-border bg-surface rounded-2xl border p-6 sm:p-8 text-center space-y-4">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${statusConfig.iconWrapperClass}`}
        >
          <StatusIcon className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-h3 font-semibold text-ink sm:text-h2">
            {statusConfig.title}
          </h1>
          <p className="text-body-sm text-ink-soft mx-auto max-w-lg">
            {statusConfig.description}
          </p>
        </div>

        {aggregateStatus === ORDER_STATUS.MENUNGGU_PEMBAYARAN && (
          <div className="pt-2 flex flex-col items-center gap-3">
            {isAutoPolling && (
              <p className="text-caption text-ink-muted">
                Memeriksa status pembayaran secara otomatis...
              </p>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={isRefreshing}
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Periksa Status Pembayaran</span>
            </Button>
          </div>
        )}
      </div>

      {/* Verified Orders Breakdown */}
      <div className="border-border bg-surface rounded-2xl border p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-border border-b pb-3">
          <h2 className="text-h4 font-semibold text-ink">Rincian Pesanan</h2>
          <span className="text-body-sm font-bold text-primary-600 tabular">
            Total: {formatRupiah(grandTotal)}
          </span>
        </div>

        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border-border bg-canvas/50 rounded-xl border p-4 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-body-sm font-semibold text-ink tabular">
                    {order.nomorOrder}
                  </p>
                  <p className="text-caption text-ink-muted">
                    Petani: {order.seller?.namaUsaha || order.seller?.name || "Petani Lokal"}
                  </p>
                </div>
                <Badge tone={getStatusBadgeTone(order.status)}>
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </Badge>
              </div>

              <div className="border-border border-t pt-2.5 flex items-center justify-between text-body-sm">
                <span className="text-ink-soft">
                  {order.items?.length || order.itemsCount || 0} jenis produk + ongkir{" "}
                  {formatRupiah(order.ongkir)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-ink tabular">
                    {formatRupiah(order.totalHarga)}
                  </span>
                  <Link
                    to={getOrderDetailPath(order.id)}
                    className="text-caption font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          {aggregateStatus === ORDER_STATUS.DIBATALKAN ? (
            <>
              <Link to={ROUTES.HOME} className="sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Kembali ke Beranda
                </Button>
              </Link>
              <Link to={ROUTES.CART} className="sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto">
                  Kembali ke Keranjang
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to={ROUTES.HOME} className="sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Lanjut Belanja
                </Button>
              </Link>
              <Link to={ROUTES.ORDERS} className="sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto">
                  Lihat Pesanan Saya
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
