import { lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes } from "react-router";
import { AuthLayout } from "../components/templates/AuthLayout";
import { MainLayout } from "../components/templates/MainLayout";
import { SellerLayout } from "../components/templates/SellerLayout";
import { Button } from "../components/atoms/Button";
import { Spinner } from "../components/atoms/Spinner";
import { useAuth } from "../features/auth";
import { GuestRoute } from "./guards/GuestRoute";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { getRoleHomePath, ROLES } from "../constants/roles";
import { ROUTES } from "../constants/routes";

const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const ProfilePage = lazy(() => import("../features/auth/pages/ProfilePage"));
const MarketplacePage = lazy(
  () => import("../features/marketplace/pages/MarketplacePage"),
);
const ProductDetailPage = lazy(
  () => import("../features/marketplace/pages/ProductDetailPage"),
);
const FarmerProfilePage = lazy(
  () => import("../features/farmer-profile/pages/FarmerProfilePage"),
);
const CartPage = lazy(() => import("../features/cart/pages/CartPage"));

// Seller Pages
const SellerOverviewPage = lazy(
  () => import("../features/seller-dashboard/pages/SellerOverviewPage"),
);
const SellerProductsPage = lazy(
  () => import("../features/seller-product/pages/SellerProductsPage"),
);
const SellerProductFormPage = lazy(
  () => import("../features/seller-product/pages/SellerProductFormPage"),
);
const FarmProfilePage = lazy(
  () => import("../features/farmer-profile/pages/FarmProfilePage"),
);

function PageFallback() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <Spinner className="text-primary-600 h-5 w-5" />
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
        {/* Public Marketplace Routes */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<MarketplacePage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
          <Route path={ROUTES.FARMER_PROFILE} element={<FarmerProfilePage />} />

          {/* Buyer Routes */}
          <Route element={<ProtectedRoute role={ROLES.BUYER} />}>
            <Route path={ROUTES.CART} element={<CartPage />} />
          </Route>
        </Route>

        {/* Auth Routes (Guest Only) */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Protected Routes (Authenticated Users) */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        {/* Seller Routes */}
        <Route element={<ProtectedRoute role={ROLES.SELLER} />}>
          <Route element={<SellerLayout />}>
            <Route
              path={ROUTES.SELLER_DASHBOARD}
              element={<SellerOverviewPage />}
            />
            <Route
              path={ROUTES.SELLER_PRODUCTS}
              element={<SellerProductsPage />}
            />
            <Route
              path={ROUTES.SELLER_PRODUCT_NEW}
              element={<SellerProductFormPage />}
            />
            <Route
              path={ROUTES.SELLER_PRODUCT_EDIT}
              element={<SellerProductFormPage />}
            />
            <Route
              path={ROUTES.SELLER_FARM_PROFILE}
              element={<FarmProfilePage />}
            />
          </Route>
        </Route>

        {/* Redirects */}
        <Route
          path={ROUTES.MARKETPLACE}
          element={<Navigate to={ROUTES.HOME} replace />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
