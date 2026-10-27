import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../../components/atoms/Button";
import { ROUTES } from "../../../constants/routes";

export function CartEmptyState() {
  return (
    <div className="border-border bg-surface mx-auto max-w-lg rounded-md border p-8 text-center sm:p-12">
      <div className="bg-primary-50 text-primary-600 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <ShoppingCart className="h-8 w-8" aria-hidden="true" />
      </div>

      <h2 className="text-h3 font-semibold text-ink">
        Keranjang belanja masih kosong
      </h2>

      <p className="text-body-sm text-ink-soft mt-2 mb-6">
        Temukan berbagai produk hasil panen segar langsung dari petani lokal di PasarTani.
      </p>

      <Link to={ROUTES.HOME}>
        <Button variant="primary">Mulai Belanja</Button>
      </Link>
    </div>
  );
}

