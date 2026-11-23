import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../auth";
import { useCart } from "../../cart";
import { CheckoutForm } from "../components/CheckoutForm";
import { CheckoutOrderSummary } from "../components/CheckoutOrderSummary";
import { useCheckout } from "../hooks/useCheckout";
import { openMidtransSnap } from "../utils/midtransSnap";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { ROUTES } from "../../../constants/routes";

function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" aria-busy="true">
      <div className="space-y-4 lg:col-span-7">
        <Skeleton className="h-8 w-52" />
        <div className="border-border bg-surface rounded-2xl border p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="border-border bg-surface rounded-2xl border p-6 space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cart, isLoading, isError, error, refetch } = useCart();
  const checkoutMutation = useCheckout();
  const [pendingPayment, setPendingPayment] = useState(null);

  const items = cart?.items || [];
  const hasUnavailableItems = items.some(
    (item) => !item.isAvailable || item.stock === 0 || item.quantity > item.stock,
  );

  useEffect(() => {
    if (pendingPayment || isLoading || isError) {
      return;
    }

    if (!cart || items.length === 0) {
      toast.error("Keranjang belanja masih kosong. Silakan pilih produk terlebih dahulu.");
      navigate(ROUTES.CART, { replace: true });
      return;
    }

    if (hasUnavailableItems) {
      toast.error(
        "Terdapat produk yang stoknya habis atau melebihi stok tersedia. Harap sesuaikan keranjang Anda.",
      );
      navigate(ROUTES.CART, { replace: true });
    }
  }, [cart, items.length, hasUnavailableItems, isLoading, isError, pendingPayment, navigate]);

  const navigateToResult = (orderIds) => {
    const query = orderIds.length > 0 ? `?orderIds=${orderIds.join(",")}` : "";
    navigate(`${ROUTES.CHECKOUT_RESULT}${query}`, {
      state: { orderIds },
    });
  };

  const launchSnap = async ({ snapToken, redirectUrl, orderIds }) => {
    const mode = await openMidtransSnap({
      snapToken,
      redirectUrl,
      onSuccess: () => {
        navigateToResult(orderIds);
      },
      onPending: () => {
        navigateToResult(orderIds);
      },
      onError: () => {
        toast.error("Pembayaran gagal diproses. Silakan cek status pesanan Anda.");
        navigateToResult(orderIds);
      },
      onClose: () => {
        toast.info(
          "Popup pembayaran ditutup. Klik Lanjutkan Pembayaran atau cek status pesanan.",
        );
      },
    });

    if (mode === "unavailable") {
      toast.error(
        "Midtrans Snap belum siap. Pastikan konfigurasi VITE_MIDTRANS_CLIENT_KEY tersedia.",
      );
      navigateToResult(orderIds);
    }
  };

  const handleCheckoutSubmit = async (formValues) => {
    try {
      const result = await checkoutMutation.mutateAsync(formValues);
      const paymentSession = {
        paymentId: result.paymentId,
        snapToken: result.snapToken,
        redirectUrl: result.redirectUrl,
        orderIds: result.orderIds || [],
      };
      setPendingPayment(paymentSession);
      await launchSnap(paymentSession);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal memproses checkout. Silakan coba lagi.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6">
        <Link
          to={ROUTES.CART}
          className="text-body-sm text-ink-soft hover:text-ink focus-visible:ring-primary-600 inline-flex items-center gap-2 font-medium focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Keranjang</span>
        </Link>
      </div>

      {isLoading && <CheckoutSkeleton />}

      {!isLoading && isError && (
        <div className="mx-auto max-w-2xl py-12">
          <Alert
            variant="error"
            title="Gagal memuat data checkout"
            action={
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Coba lagi
              </Button>
            }
          >
            {error?.response?.data?.message ||
              error?.message ||
              "Terjadi kesalahan saat memuat ringkasan keranjang Anda."}
          </Alert>
        </div>
      )}

      {!isLoading && !isError && cart && items.length > 0 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-h3 font-semibold text-ink sm:text-h2">Checkout</h1>
            <p className="text-body-sm text-ink-soft mt-1">
              Lengkapi data penerima dan periksa rincian pesanan sebelum membayar.
            </p>
          </div>

          {pendingPayment && (
            <Alert variant="warning" title="Pesanan telah dibuat — Menunggu Pembayaran">
              Pesanan Anda sudah tercatat. Silakan klik{" "}
              <strong>Lanjutkan Pembayaran</strong> untuk membuka kembali popup Midtrans
              Snap atau lihat status pesanan Anda.
            </Alert>
          )}

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <section className="lg:col-span-7">
              <CheckoutForm
                formId="checkout-form"
                defaultValues={{
                  namaPenerima: user?.nama || user?.name || "",
                  noTelepon: user?.noTelepon || user?.phone || "",
                }}
                onSubmit={handleCheckoutSubmit}
                disabled={checkoutMutation.isPending || Boolean(pendingPayment)}
              />
            </section>

            <aside className="lg:col-span-5 lg:sticky lg:top-24">
              <CheckoutOrderSummary
                cart={cart}
                formId="checkout-form"
                isSubmitting={checkoutMutation.isPending}
                hasPendingPayment={Boolean(pendingPayment)}
                onResumePayment={() => pendingPayment && launchSnap(pendingPayment)}
                onViewOrderStatus={() =>
                  pendingPayment && navigateToResult(pendingPayment.orderIds)
                }
              />
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
