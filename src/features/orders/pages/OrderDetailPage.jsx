import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Store,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useBuyerOrderDetail } from "../hooks/useBuyerOrderDetail";
import { useConfirmOrderReceived } from "../hooks/useConfirmOrderReceived";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderStatusTimeline } from "../components/OrderStatusTimeline";
import { ConfirmOrderDialog } from "../components/ConfirmOrderDialog";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { ORDER_STATUS } from "../../../constants/orderStatus";
import { getFarmerProfilePath, ROUTES } from "../../../constants/routes";
import { formatDateTime } from "../../../utils/formatDate";
import { formatRupiah } from "../../marketplace";

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Memuat detail pesanan">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useBuyerOrderDetail(orderId);
  const confirmMutation = useConfirmOrderReceived();

  const isNotFound = error?.response?.status === 404;
  const canConfirmReceived = order?.status === ORDER_STATUS.DIKIRIM;

  const handleConfirmReceived = async () => {
    try {
      await confirmMutation.mutateAsync(order.id);
      setIsConfirmOpen(false);
      toast.success("Pesanan berhasil dikonfirmasi diterima. Terima kasih!");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal mengonfirmasi pesanan diterima.";
      toast.error(msg);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6">
        <Link
          to={ROUTES.ORDERS}
          className="text-body-sm text-ink-soft hover:text-ink focus-visible:ring-primary-600 inline-flex items-center gap-2 font-medium focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Pesanan Saya</span>
        </Link>
      </div>

      {isLoading && <OrderDetailSkeleton />}

      {!isLoading && isError && isNotFound && (
        <div className="border-border bg-surface mx-auto max-w-lg rounded-2xl border p-8 text-center space-y-4">
          <h1 className="text-h3 font-semibold text-ink">Pesanan tidak ditemukan</h1>
          <p className="text-body-sm text-ink-soft">
            Pesanan yang Anda cari tidak tersedia atau tidak dapat diakses.
          </p>
          <div>
            <Link to={ROUTES.ORDERS}>
              <Button variant="primary">Kembali ke Daftar Pesanan</Button>
            </Link>
          </div>
        </div>
      )}

      {!isLoading && isError && !isNotFound && (
        <Alert
          variant="error"
          title="Gagal memuat detail pesanan"
          action={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Coba lagi
            </Button>
          }
        >
          {error?.response?.data?.message ||
            error?.message ||
            "Terjadi kesalahan saat memuat detail pesanan."}
        </Alert>
      )}

      {!isLoading && !isError && order && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border-border bg-surface rounded-2xl border p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-h3 font-semibold text-ink tabular sm:text-h2">
                  {order.nomorOrder}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-caption text-ink-muted tabular">
                Dipesan pada {formatDateTime(order.tanggalOrder)}
              </p>
            </div>

            {canConfirmReceived && (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setIsConfirmOpen(true)}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Konfirmasi Pesanan Diterima</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Left column: Items, Recipient, Payment */}
            <div className="space-y-6 lg:col-span-8">
              {/* Items & Seller */}
              <section className="border-border bg-surface rounded-2xl border p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-border border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-primary-600" aria-hidden="true" />
                    <h2 className="text-h4 font-semibold text-ink">
                      {order.seller?.namaUsaha || order.seller?.name || "Petani Lokal"}
                    </h2>
                  </div>
                  {order.seller?.id && (
                    <Link
                      to={getFarmerProfilePath(order.seller.id)}
                      className="text-caption font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      Lihat Profil Petani
                    </Link>
                  )}
                </div>

                <div className="divide-border divide-y">
                  {(order.items || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-media-bg">
                        <ImageWithFallback
                          src={item.gambarUrl}
                          alt={item.nama || "Produk"}
                          aspectRatio={1}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-body-sm font-semibold text-ink line-clamp-2">
                          {item.nama || "Produk"}
                        </p>
                        <p className="text-caption text-ink-muted tabular">
                          {item.jumlah} {item.satuan || "unit"} ×{" "}
                          {formatRupiah(item.hargaSatuan)}
                        </p>
                      </div>
                      <p className="text-body-sm font-semibold text-ink tabular shrink-0">
                        {formatRupiah(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-border border-t pt-4 space-y-2 text-body-sm">
                  <div className="flex items-center justify-between text-ink-soft">
                    <span>Subtotal Produk</span>
                    <span className="tabular font-medium text-ink">
                      {formatRupiah(order.itemsSubtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-ink-soft">
                    <span>Ongkos Kirim</span>
                    <span className="tabular font-medium text-ink">
                      {formatRupiah(order.ongkir)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-border border-t pt-3">
                    <span className="text-body font-semibold text-ink">Total Harga</span>
                    <span className="text-h3 font-bold text-primary-600 tabular">
                      {formatRupiah(order.totalHarga)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Recipient & Payment Info */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <section className="border-border bg-surface rounded-2xl border p-5 space-y-3">
                  <div className="flex items-center gap-2 text-h4 font-semibold text-ink">
                    <User className="h-4 w-4 text-primary-600" aria-hidden="true" />
                    <h2>Info Penerima</h2>
                  </div>
                  <div className="space-y-2 text-body-sm">
                    <div>
                      <p className="text-caption text-ink-muted">Nama Penerima</p>
                      <p className="font-medium text-ink">{order.namaPenerima}</p>
                    </div>
                    {order.seller?.lokasi && (
                      <div className="flex items-start gap-1.5 text-caption text-ink-soft">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
                        <span>Asal kebun: {order.seller.lokasi}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-caption text-ink-muted">Catatan</p>
                      <p className="text-ink-soft">
                        {order.catatan || "Tidak ada catatan."}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="border-border bg-surface rounded-2xl border p-5 space-y-3">
                  <div className="flex items-center gap-2 text-h4 font-semibold text-ink">
                    <CreditCard className="h-4 w-4 text-primary-600" aria-hidden="true" />
                    <h2>Info Pembayaran</h2>
                  </div>
                  {order.payment ? (
                    <div className="space-y-2 text-body-sm">
                      <div>
                        <p className="text-caption text-ink-muted">Status Pembayaran</p>
                        <p className="font-medium text-ink">{order.payment.status}</p>
                      </div>
                      <div>
                        <p className="text-caption text-ink-muted">Metode</p>
                        <p className="text-ink-soft">
                          {order.payment.metodePembayaran || "Midtrans Snap"}
                        </p>
                      </div>
                      {order.payment.paidAt && (
                        <div>
                          <p className="text-caption text-ink-muted">Waktu Bayar</p>
                          <p className="text-ink-soft tabular">
                            {formatDateTime(order.payment.paidAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-body-sm text-ink-muted">
                      Data pembayaran belum tersedia.
                    </p>
                  )}
                </section>
              </div>
            </div>

            {/* Right column: Status History Timeline */}
            <aside className="border-border bg-surface rounded-2xl border p-5 sm:p-6 space-y-4 lg:col-span-4 lg:sticky lg:top-24">
              <h2 className="text-h4 font-semibold text-ink border-border border-b pb-3">
                Riwayat Status
              </h2>
              <OrderStatusTimeline statusHistory={order.statusHistory} />
            </aside>
          </div>

          <ConfirmOrderDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            orderNumber={order.nomorOrder}
            onConfirm={handleConfirmReceived}
            isPending={confirmMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
