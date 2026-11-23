import { Link, useSearchParams } from "react-router";
import { Package } from "lucide-react";
import { useBuyerOrders } from "../hooks/useBuyerOrders";
import { OrderStatusTabs } from "../components/OrderStatusTabs";
import { OrderCard } from "../components/OrderCard";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { Pagination } from "../../../components/molecules/Pagination";
import { ORDER_STATUS } from "../../../constants/orderStatus";
import { ROUTES } from "../../../constants/routes";

const VALID_STATUSES = new Set(Object.values(ORDER_STATUS));
const PAGE_LIMIT = 10;

function OrdersSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Memuat daftar pesanan">
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="border-border bg-surface rounded-2xl border p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-border border-b pb-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton aspectRatio={1} className="h-16 w-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStatus = searchParams.get("status") || "";
  const status = VALID_STATUSES.has(rawStatus) ? rawStatus : "";

  const rawPage = Number(searchParams.get("page") || "1");
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const { data, isLoading, isError, error, refetch } = useBuyerOrders({
    page,
    limit: PAGE_LIMIT,
    status: status || undefined,
  });

  const orders = data?.orders || [];
  const meta = data?.meta || { page, totalPages: 1, total: 0 };

  const handleStatusChange = (nextStatus) => {
    const nextParams = new URLSearchParams();
    if (nextStatus) {
      nextParams.set("status", nextStatus);
    }
    setSearchParams(nextParams);
  };

  const handlePageChange = (nextPage) => {
    const nextParams = new URLSearchParams();
    if (status) {
      nextParams.set("status", status);
    }
    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12 space-y-6">
      <div className="space-y-1">
        <h1 className="text-h3 font-semibold text-ink sm:text-h2">Pesanan Saya</h1>
        <p className="text-body-sm text-ink-soft">
          Pantau status pembayaran, pengemasan, hingga pengiriman hasil panen Anda.
        </p>
      </div>

      <OrderStatusTabs activeStatus={status} onChange={handleStatusChange} />

      {isLoading && <OrdersSkeleton />}

      {!isLoading && isError && (
        <Alert
          variant="error"
          title="Gagal memuat riwayat pesanan"
          action={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Coba lagi
            </Button>
          }
        >
          {error?.response?.data?.message ||
            error?.message ||
            "Terjadi kesalahan saat memuat daftar pesanan Anda."}
        </Alert>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="border-border bg-surface rounded-2xl border p-10 text-center space-y-4">
          <div className="bg-primary-50 text-primary-600 mx-auto flex h-14 w-14 items-center justify-center rounded-full">
            <Package className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-h4 font-semibold text-ink">
              {status ? "Tidak ada pesanan dengan status ini" : "Belum ada pesanan."}
            </h2>
            <p className="text-body-sm text-ink-soft mx-auto max-w-md">
              {status
                ? "Coba pilih filter status lain atau tampilkan semua pesanan Anda."
                : "Yuk, jelajahi produk segar langsung dari petani lokal di PasarTani!"}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            {status ? (
              <Button variant="secondary" onClick={() => handleStatusChange("")}>
                Tampilkan Semua Pesanan
              </Button>
            ) : (
              <Link to={ROUTES.HOME}>
                <Button variant="primary">Mulai Belanja</Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          <Pagination
            page={meta.page || page}
            totalPages={meta.totalPages || 1}
            onChange={handlePageChange}
            className="pt-4"
          />
        </div>
      )}
    </div>
  );
}
