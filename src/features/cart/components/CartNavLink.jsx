import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { ROUTES } from "../../../constants/routes";

export function CartNavLink() {
  const { data } = useCart();
  const totalItems = data?.totalItems || 0;

  const ariaLabel =
    totalItems > 0
      ? `Keranjang belanja, ${totalItems} produk`
      : "Keranjang belanja";

  return (
    <Link
      to={ROUTES.CART}
      aria-label={ariaLabel}
      className="border-border bg-surface text-ink hover:bg-canvas relative inline-flex h-10 items-center justify-center rounded-sm border px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
    >
      <ShoppingCart className="h-4 w-4 text-primary-600" aria-hidden="true" />
      <span className="hidden sm:inline sm:ml-1.5 text-body-sm font-medium">
        Keranjang
      </span>
      {totalItems > 0 && (
        <span
          className="bg-primary-600 text-surface text-[11px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center -mr-1 ml-1.5 tabular"
          aria-hidden="true"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}

