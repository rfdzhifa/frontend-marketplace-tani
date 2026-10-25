import { Link, Outlet } from 'react-router';
import { LogOut, Sprout, User } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { useAuth } from '../../../features/auth';
import { ROLES } from '../../../constants/roles';
import { ROUTES } from '../../../constants/routes';

export function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2.5 rounded-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary-600 text-surface">
              <Sprout className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-h4 font-semibold text-ink">PasarTani</span>
          </Link>

          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === ROLES.SELLER && (
                  <Link
                    to={ROUTES.SELLER_DASHBOARD}
                    className="text-body-sm font-medium text-ink-soft hover:text-ink"
                  >
                    Dashboard Petani
                  </Link>
                )}
                <Link
                  to={ROUTES.PROFILE}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-body-sm font-medium text-ink hover:bg-canvas"
                >
                  <User
                    className="h-4 w-4 text-primary-600"
                    aria-hidden="true"
                  />
                  <span>{user?.name || 'Profil'}</span>
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

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-canvas py-6 text-center">
        <p className="text-caption text-ink-muted">
          © 2026 PasarTani. Marketplace Produk Petani Lokal.
        </p>
      </footer>
    </div>
  );
}
