import { Link } from "react-router";
import { Package, Store, User } from "lucide-react";
import { Button } from "../../../components/atoms/Button";
import { useAuth } from "../../auth";
import { ROLE_LABELS, ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

export default function SellerOverviewPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 text-ink font-semibold">
          Halo, {user?.name || "Petani"}
        </h1>
        <p className="text-body-sm text-ink-soft mt-1">
          Selamat datang di panel penjual PasarTani. Anda masuk sebagai{" "}
          <span className="text-ink font-semibold">
            {ROLE_LABELS[user?.role] || ROLES.SELLER}
          </span>
          .
        </p>
      </div>

      <div className="border-border bg-surface rounded-md border p-6 sm:p-8">
        <h2 className="text-h3 text-ink font-semibold">
          Kelola Penjualan Anda
        </h2>
        <p className="text-body-sm text-ink-soft mt-2 max-w-2xl">
          Mulai dengan menambahkan hasil panen dan produk pertanian Anda, atau
          lengkapi informasi profil kebun agar pembeli lebih mengenal usaha
          Anda.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={ROUTES.SELLER_PRODUCTS}>
            <Button variant="primary" className="gap-2">
              <Package className="h-4 w-4" aria-hidden="true" />
              Kelola Produk Saya
            </Button>
          </Link>
          <Link to={ROUTES.SELLER_FARM_PROFILE}>
            <Button variant="secondary" className="gap-2">
              <Store className="h-4 w-4" aria-hidden="true" />
              Kelola Profil Petani
            </Button>
          </Link>
          <Link to={ROUTES.PROFILE}>
            <Button variant="secondary" className="gap-2">
              <User className="h-4 w-4" aria-hidden="true" />
              Edit Profil Akun
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
