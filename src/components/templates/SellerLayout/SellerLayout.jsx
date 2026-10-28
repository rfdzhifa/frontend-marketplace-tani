import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Sprout,
  Star,
  Store,
  User,
  X,
} from "lucide-react";
import { Button } from "../../atoms/Button";
import { useAuth } from "../../../features/auth";
import { ROUTES } from "../../../constants/routes";
import { cn } from "../../../utils/cn";

export function SellerLayout() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      to: ROUTES.SELLER_DASHBOARD,
      label: "Overview",
      icon: LayoutDashboard,
      disabled: false,
    },
    {
      to: ROUTES.SELLER_PRODUCTS,
      label: "Produk",
      icon: Package,
      disabled: false,
    },
    {
      to: "/seller/orders",
      label: "Pesanan",
      icon: ShoppingBag,
      disabled: true,
      badge: "Segera hadir",
    },
    {
      to: "/seller/reviews",
      label: "Ulasan",
      icon: Star,
      disabled: true,
      badge: "Segera hadir",
    },
    {
      to: ROUTES.SELLER_FARM_PROFILE,
      label: "Profil Petani",
      icon: Store,
      disabled: false,
    },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="border-border flex h-16 items-center justify-between border-b px-5">
          <Link
            to={ROUTES.SELLER_DASHBOARD}
            onClick={closeMobileMenu}
            className="text-ink focus-visible:ring-primary-600 inline-flex items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="bg-primary-600 text-surface flex h-9 w-9 items-center justify-center rounded-sm">
              <Sprout className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-h4 text-ink leading-tight font-semibold">
                PasarTani
              </span>
              <span className="text-caption text-ink-muted leading-none">
                Panel Penjual
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={closeMobileMenu}
            className="text-ink-soft hover:bg-canvas rounded-sm p-1.5 lg:hidden"
            aria-label="Tutup menu navigasi"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation items */}
        <nav
          className="space-y-1.5 p-4"
          role="navigation"
          aria-label="Navigasi Penjual"
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className="text-ink-muted/60 text-body-sm flex cursor-not-allowed items-center justify-between rounded-sm px-3 py-2.5 font-medium select-none"
                  aria-disabled="true"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className="h-5 w-5 shrink-0 opacity-40"
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-canvas border-border text-ink-muted rounded-full border px-2 py-0.5 text-[10px] font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.SELLER_DASHBOARD}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  cn(
                    "text-body-sm focus-visible:ring-primary-600 flex items-center gap-3 rounded-sm px-3 py-2.5 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    isActive
                      ? "bg-primary-100 text-primary-800 font-semibold"
                      : "text-ink-soft hover:bg-canvas hover:text-ink",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-primary-600" : "text-ink-muted",
                      )}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User info & Logout */}
      <div className="border-border space-y-3 border-t p-4">
        <Link
          to={ROUTES.PROFILE}
          onClick={closeMobileMenu}
          className="border-border bg-canvas/60 hover:bg-canvas hover:border-primary-600/30 focus-visible:ring-primary-600 flex items-center gap-3 rounded-sm border p-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <div className="bg-primary-100 text-primary-700 text-caption flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold">
            {user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-body-sm text-ink truncate leading-tight font-semibold">
              {user?.name || "Petani"}
            </p>
            <p className="text-caption text-ink-muted mt-0.5 truncate leading-tight">
              Edit profil akun
            </p>
          </div>
        </Link>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-center gap-2"
          onClick={() => {
            closeMobileMenu();
            logout();
          }}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-canvas flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="border-border bg-surface fixed inset-y-0 left-0 z-30 hidden w-60 border-r lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileMenuOpen && (
        <div
          className="bg-ink/40 fixed inset-0 z-40 backdrop-blur-xs lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "border-border bg-surface fixed inset-y-0 left-0 z-50 w-64 border-r transition-transform duration-200 ease-in-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </div>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        {/* Mobile Header */}
        <header className="border-border bg-surface sticky top-0 z-20 flex h-14 items-center justify-between border-b px-4 lg:hidden">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-ink hover:bg-canvas focus-visible:ring-primary-600 rounded-sm p-2 focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="text-body-sm text-ink font-semibold">
              PasarTani Penjual
            </span>
          </div>

          <Link
            to={ROUTES.PROFILE}
            className="text-ink-soft hover:text-ink text-caption flex items-center gap-1.5 font-medium"
          >
            <User className="text-primary-600 h-4 w-4" aria-hidden="true" />
            <span className="max-w-[120px] truncate">{user?.name}</span>
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
