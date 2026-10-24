import { lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes } from "react-router";
import { LogOut, Sprout, User } from "lucide-react";
import { AuthLayout } from "../components/templates/AuthLayout";
import { Button } from "../components/atoms/Button";
import { Spinner } from "../components/atoms/Spinner";
import { useAuth } from "../features/auth";
import { GuestRoute } from "./guards/GuestRoute";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { getRoleHomePath, ROLE_LABELS, ROLES } from "../constants/roles";
import { ROUTES } from "../constants/routes";

const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const ProfilePage = lazy(() => import("../features/auth/pages/ProfilePage"));

function PageFallback() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <Spinner className="text-primary-600 h-5 w-5" />
    </div>
  );
}

function TopNavigation() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-border bg-surface border-b">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link
          to={ROUTES.HOME}
          className="text-ink focus-visible:ring-primary-600 inline-flex items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span className="bg-primary-600 text-surface flex h-9 w-9 items-center justify-center rounded-sm">
            <Sprout className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-h4 text-ink font-semibold">PasarTani</span>
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {user?.role === ROLES.SELLER && (
                <Link
                  to={ROUTES.SELLER_DASHBOARD}
                  className="text-body-sm text-ink-soft hover:text-ink font-medium"
                >
                  Dashboard Petani
                </Link>
              )}
              <Link
                to={ROUTES.PROFILE}
                className="border-border bg-surface text-body-sm text-ink hover:bg-canvas inline-flex items-center gap-1.5 rounded-sm border px-3 py-2 font-medium"
              >
                <User className="text-primary-600 h-4 w-4" aria-hidden="true" />
                <span>{user?.name || "Profil"}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Keluar
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
  );
}

function MarketplaceHomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="bg-surface min-h-screen">
      <TopNavigation />
      <main className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="border-border bg-canvas mx-auto max-w-2xl rounded-lg border p-8 text-center">
          <span className="bg-primary-100 text-caption text-primary-800 inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-semibold">
            Marketplace Produk Petani Lokal
          </span>
          <h1 className="text-h2 text-ink mt-4 font-semibold">
            Hasil Panen Segar Langsung dari Petani Lokal
          </h1>
          <p className="text-body text-ink-soft mt-2">
            {isAuthenticated
              ? `Selamat datang kembali, ${user?.name} (${ROLE_LABELS[user?.role] || user?.role}).`
              : "Hubungkan kebutuhan pangan harian Anda langsung dengan petani lokal terpercaya."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.PROFILE}>
                  <Button variant="primary">Kelola Profil Akun</Button>
                </Link>
                {user?.role === ROLES.SELLER && (
                  <Link to={ROUTES.SELLER_DASHBOARD}>
                    <Button variant="secondary">Buka Dashboard Petani</Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary">Mulai Daftar</Button>
                </Link>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="secondary">Masuk ke Akun</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SellerDashboardPlaceholderPage() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-canvas min-h-screen">
      <header className="border-border bg-surface border-b">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.SELLER_DASHBOARD}
              className="text-ink inline-flex items-center gap-2.5"
            >
              <span className="bg-primary-600 text-surface flex h-9 w-9 items-center justify-center rounded-sm">
                <Sprout className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-h4 text-ink font-semibold">PasarTani</span>
            </Link>
            <span className="bg-primary-100 text-caption text-primary-800 rounded-full px-3 py-1 font-semibold">
              Dashboard Petani
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.PROFILE}
              className="border-border bg-surface text-body-sm text-ink hover:bg-canvas inline-flex items-center gap-1.5 rounded-sm border px-3 py-2 font-medium"
            >
              <User className="text-primary-600 h-4 w-4" aria-hidden="true" />
              <span>{user?.name || "Profil"}</span>
            </Link>
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="border-border bg-surface rounded-md border p-6 sm:p-8">
          <h1 className="text-h2 text-ink font-semibold">
            Halo, {user?.name || "Petani"}
          </h1>
          <p className="text-body-sm text-ink-soft mt-1">
            Anda berhasil masuk sebagai{" "}
            <span className="text-ink font-semibold">
              {ROLE_LABELS[user?.role] || ROLES.SELLER}
            </span>
            . Ringkasan penjualan dan manajemen produk akan ditampilkan di
            halaman ini setelah modul Seller Dashboard diintegrasikan.
          </p>
          <div className="mt-6">
            <Link to={ROUTES.PROFILE}>
              <Button variant="secondary">Edit Profil Akun</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function NotFoundPage() {
  const { isAuthenticated, user } = useAuth();
  const backPath = isAuthenticated ? getRoleHomePath(user?.role) : ROUTES.HOME;

  return (
    <div className="bg-canvas flex min-h-screen items-center justify-center px-4">
      <div className="border-border bg-surface w-full max-w-md rounded-md border p-8 text-center">
        <p className="text-caption text-primary-600 font-semibold">404</p>
        <h1 className="text-h3 text-ink mt-2 font-semibold">
          Halaman tidak ditemukan
        </h1>
        <p className="text-body-sm text-ink-soft mt-2">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="mt-6">
          <Link to={backPath}>
            <Button variant="primary">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<MarketplaceHomePage />} />
        <Route
          path={ROUTES.MARKETPLACE}
          element={<Navigate to={ROUTES.HOME} replace />}
        />

        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route element={<ProtectedRoute role={ROLES.SELLER} />}>
          <Route
            path={ROUTES.SELLER_DASHBOARD}
            element={<SellerDashboardPlaceholderPage />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
