import { useState } from "react";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router";
import {
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Sprout,
  User,
} from "lucide-react";
import { Button } from "../../atoms/Button";
import { useAuth } from "../../../features/auth";
import { CartNavLink } from "../../../features/cart";
import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

function HeaderSearchBar({ defaultValue = "", onSubmitSearch }) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mx-6 hidden max-w-md flex-1 md:flex"
    >
      <div className="relative flex w-full items-center">
        <Search
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari sayur, buah, atau beras organik..."
          aria-label="Cari produk di PasarTani"
          className="h-10 w-full rounded-full border border-border bg-canvas pr-20 pl-10 text-body-sm text-ink placeholder:text-ink-muted transition-colors focus-visible:border-primary-600 focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:outline-none"
        />
        <button
          type="submit"
          className="absolute right-1.5 rounded-full bg-primary-600 px-3.5 py-1 text-caption font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1 focus-visible:outline-none cursor-pointer"
        >
          Cari
        </button>
      </div>
    </form>
  );
}

export function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const handleHeaderSearch = (keyword) => {
    if (keyword) {
      navigate(`/?search=${encodeURIComponent(keyword)}`);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Floating Pill Header */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2 sm:px-6">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 rounded-full border border-border/90 bg-surface/90 px-4 shadow-card backdrop-blur-md sm:h-16 sm:px-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-full pr-2 text-ink focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-surface ring-2 ring-harvest-lime/35">
              <Sprout className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-h4 font-semibold tracking-tight text-ink">
              Pasar<span className="text-primary-600">Tani</span>
            </span>
          </Link>

          {/* Desktop Centered Search Pill */}
          <HeaderSearchBar
            key={urlSearch}
            defaultValue={urlSearch}
            onSubmitSearch={handleHeaderSearch}
          />

          <nav
            aria-label="Navigasi utama"
            className="flex shrink-0 items-center gap-2 sm:gap-3"
          >
            {isAuthenticated ? (
              <>
                {user?.role === ROLES.BUYER && <CartNavLink />}
                {user?.role === ROLES.SELLER && (
                  <Link
                    to={ROUTES.SELLER_DASHBOARD}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-body-sm font-medium text-ink-soft transition-colors hover:bg-canvas hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                  >
                    <LayoutDashboard
                      className="h-4 w-4 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">Dashboard Petani</span>
                  </Link>
                )}
                <Link
                  to={ROUTES.PROFILE}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-body-sm font-medium text-ink transition-colors hover:bg-canvas focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                >
                  <User
                    className="h-4 w-4 text-primary-600"
                    aria-hidden="true"
                  />
                  <span className="max-w-[110px] truncate sm:max-w-[140px]">
                    {user?.name || "Profil"}
                  </span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Keluar</span>
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="secondary" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 4-Column Rich Footer */}
      <footer className="mt-12 border-t border-border bg-canvas pt-12 pb-8">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Brand & Sustainability */}
            <div className="space-y-3">
              <Link
                to={ROUTES.HOME}
                className="inline-flex items-center gap-2 text-ink"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-surface">
                  <Sprout className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-h4 font-semibold">PasarTani</span>
              </Link>
              <p className="text-body-sm leading-relaxed text-ink-soft">
                Menghubungkan hasil panen segar petani lokal Indonesia langsung
                ke meja makan Anda dengan harga adil dan kualitas terjaga.
              </p>
            </div>

            {/* Column 2: Belanja Segar */}
            <div className="space-y-3">
              <h3 className="text-body-sm font-semibold text-ink">
                Belanja Segar
              </h3>
              <ul className="space-y-2 text-body-sm text-ink-soft">
                <li>
                  <Link
                    to="/?category=sayuran"
                    className="transition-colors hover:text-primary-600"
                  >
                    Sayuran Daun
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=buah"
                    className="transition-colors hover:text-primary-600"
                  >
                    Buah Segar
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=beras"
                    className="transition-colors hover:text-primary-600"
                  >
                    Beras Organik
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=umbi"
                    className="transition-colors hover:text-primary-600"
                  >
                    Umbi &amp; Kacang
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Mitra Petani */}
            <div className="space-y-3">
              <h3 className="text-body-sm font-semibold text-ink">
                Kemitraan Petani
              </h3>
              <ul className="space-y-2 text-body-sm text-ink-soft">
                <li>
                  <Link
                    to={ROUTES.REGISTER}
                    className="transition-colors hover:text-primary-600"
                  >
                    Gabung Sebagai Petani
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.LOGIN}
                    className="transition-colors hover:text-primary-600"
                  >
                    Masuk Panel Kebun
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.HOME}
                    className="transition-colors hover:text-primary-600"
                  >
                    Jelajahi Katalog Lokal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Bantuan & Jaminan */}
            <div className="space-y-3">
              <h3 className="text-body-sm font-semibold text-ink">
                Layanan &amp; Keamanan
              </h3>
              <ul className="space-y-2 text-body-sm text-ink-soft">
                <li className="flex items-center gap-2">
                  <Mail
                    className="h-4 w-4 shrink-0 text-primary-600"
                    aria-hidden="true"
                  />
                  <span>bantuan@pasartani.id</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone
                    className="h-4 w-4 shrink-0 text-primary-600"
                    aria-hidden="true"
                  />
                  <span className="tabular">0800-1500-826</span>
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-caption font-semibold text-primary-800">
                <ShieldCheck
                  className="h-4 w-4 text-primary-600"
                  aria-hidden="true"
                />
                <span>Transaksi Aman &amp; Terverifikasi</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-caption text-ink-muted sm:flex-row">
            <p>© 2026 PasarTani. Marketplace Produk Petani Lokal.</p>
            <p>Dari kebun lokal, untuk dapur keluarga Indonesia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
