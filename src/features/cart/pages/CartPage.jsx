import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useUpdateCartItem } from "../hooks/useUpdateCartItem";
import { useRemoveCartItem } from "../hooks/useRemoveCartItem";
import { CartItemRow } from "../components/CartItemRow";
import { CartSummary } from "../components/CartSummary";
import { CartEmptyState } from "../components/CartEmptyState";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { ROUTES } from "../../../constants/routes";

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" aria-busy="true" aria-label="Memuat keranjang">
      <div className="space-y-4 lg:col-span-8">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((key) => (
            <div key={key} className="border-border bg-surface flex gap-4 rounded-md border p-4 sm:p-5">
              <Skeleton aspectRatio={1} className="h-20 w-20 rounded-md sm:h-24 sm:w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="border-border bg-surface space-y-4 rounded-md border p-5 sm:p-6">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { data: cart, isLoading, isError, error, refetch } = useCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

  const handleUpdateQuantity = async (itemId, quantity) => {
    setUpdatingItemId(itemId);
    try {
      await updateMutation.mutateAsync({ itemId, quantity });
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setRemovingItemId(itemId);
    try {
      await removeMutation.mutateAsync(itemId);
    } finally {
      setRemovingItemId(null);
    }
  };

  const isEmpty = !isLoading && (!cart || !Array.isArray(cart.items) || cart.items.length === 0);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to={ROUTES.HOME}
          className="text-body-sm text-ink-soft hover:text-ink focus-visible:ring-primary-600 inline-flex items-center gap-2 font-medium focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Lanjut berbelanja</span>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && <CartSkeleton />}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="mx-auto max-w-2xl py-12">
          <Alert
            variant="error"
            title="Gagal memuat keranjang"
            action={
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Coba lagi
              </Button>
            }
          >
            {error?.response?.data?.message ||
              error?.message ||
              "Terjadi kesalahan saat memuat keranjang belanja Anda."}
          </Alert>
        </div>
      )}

      {/* Empty State */}
      {isEmpty && !isError && <CartEmptyState />}

      {/* Success State with Items */}
      {!isLoading && !isError && !isEmpty && cart && (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Items List Column */}
          <section className="space-y-4 lg:col-span-8">
            <div className="flex items-baseline justify-between">
              <h1 className="text-h3 font-semibold text-ink sm:text-h2">
                Keranjang Belanja
              </h1>
              <span className="text-body-sm text-ink-muted">
                {cart.totalItems} produk
              </span>
            </div>

            <div className="space-y-3">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                  isUpdating={updatingItemId === item.id}
                  isRemoving={removingItemId === item.id}
                />
              ))}
            </div>
          </section>

          {/* Order Summary Column */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <CartSummary cart={cart} />
          </aside>
        </div>
      )}
    </div>
  );
}

