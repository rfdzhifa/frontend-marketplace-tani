import { Link, useLocation, useParams, useSearchParams } from "react-router";
import { usePaymentResult } from "../hooks/usePaymentResult";
import { PaymentResultCard } from "../components/PaymentResultCard";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { ROUTES } from "../../../constants/routes";

function ResultSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6" aria-busy="true">
      <div className="border-border bg-surface rounded-2xl border p-8 space-y-4">
        <Skeleton className="mx-auto h-14 w-14 rounded-full" />
        <Skeleton className="mx-auto h-7 w-64" />
        <Skeleton className="mx-auto h-4 w-80" />
      </div>
      <div className="border-border bg-surface rounded-2xl border p-6 space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const orderIdsParam = searchParams.get("orderIds");
  const midtransOrderId = searchParams.get("order_id") || undefined;

  const parsedOrderIds = orderId
    ? [Number(orderId)]
    : orderIdsParam
      ? orderIdsParam
          .split(",")
          .map((id) => Number(id.trim()))
          .filter((id) => Number.isInteger(id) && id > 0)
      : Array.isArray(location.state?.orderIds)
        ? location.state.orderIds
        : [];

  const {
    data: orders,
    isLoading,
    isError,
    error,
    isFetching,
    isAutoPolling,
    refreshStatus,
  } = usePaymentResult({
    orderIds: parsedOrderIds,
    midtransOrderId,
  });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
      {isLoading && <ResultSkeleton />}

      {!isLoading && isError && (
        <div className="mx-auto max-w-2xl py-8">
          <Alert
            variant="error"
            title="Gagal memverifikasi status pembayaran"
            action={
              <Button variant="secondary" size="sm" onClick={refreshStatus}>
                Coba lagi
              </Button>
            }
          >
            {error?.response?.data?.message ||
              error?.message ||
              "Terjadi kesalahan saat mengambil status pesanan dari server."}
          </Alert>
        </div>
      )}

      {!isLoading && !isError && (!orders || orders.length === 0) && (
        <div className="border-border bg-surface mx-auto max-w-lg rounded-2xl border p-8 text-center space-y-4">
          <h1 className="text-h3 font-semibold text-ink">Pesanan tidak ditemukan</h1>
          <p className="text-body-sm text-ink-soft">
            Kami tidak menemukan data pesanan untuk pembayaran ini. Silakan periksa kembali
            atau lanjutkan berbelanja.
          </p>
          <div>
            <Link to={ROUTES.HOME}>
              <Button variant="primary">Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <PaymentResultCard
          orders={orders}
          isAutoPolling={isAutoPolling}
          isRefreshing={isFetching}
          onRefresh={refreshStatus}
        />
      )}
    </div>
  );
}
