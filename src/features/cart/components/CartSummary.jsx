import { Link } from "react-router";
import { Button } from "../../../components/atoms/Button";
import { ROUTES } from "../../../constants/routes";
import { formatRupiah } from "../../marketplace";

export function CartSummary({ cart }) {
  const hasItems = Boolean(cart?.items?.length);
  const hasUnavailableItems = Boolean(
    cart?.items?.some((item) => !item.isAvailable || item.stock === 0)
  );
  const isCheckoutDisabled = !hasItems || hasUnavailableItems;

  return (
    <div className="border-border bg-surface rounded-md border p-5 sm:p-6 space-y-5">
      <h2 className="text-h4 font-semibold text-ink">Ringkasan Belanja</h2>

      <div className="space-y-3 border-border border-b pb-4 text-body-sm">
        <div className="flex items-center justify-between text-ink-soft">
          <span>Total Item</span>
          <span className="tabular font-medium text-ink">
            {cart.totalItems} produk
          </span>
        </div>

        <div className="flex items-center justify-between text-ink-soft">
          <span>Jenis Produk</span>
          <span className="tabular font-medium text-ink">
            {cart.itemCount} jenis
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-body font-semibold text-ink">Total Harga</span>
        <span className="text-h3 font-bold text-primary-600 tabular">
          {formatRupiah(cart.totalPrice)}
        </span>
      </div>

      {hasUnavailableItems && (
        <div className="border-warning-600/30 bg-warning-50 text-warning-600 rounded-sm border p-3 text-caption font-medium">
          Terdapat produk yang stoknya habis di keranjang Anda. Harap hapus produk tersebut sebelum melanjutkan.
        </div>
      )}

      <div>
        {isCheckoutDisabled ? (
          <Button variant="primary" size="lg" disabled className="w-full">
            Lanjut ke Checkout
          </Button>
        ) : (
          <Link to={ROUTES.CHECKOUT} className="block">
            <Button variant="primary" size="lg" className="w-full">
              Lanjut ke Checkout
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

