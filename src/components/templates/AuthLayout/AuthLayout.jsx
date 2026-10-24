import { Sprout } from "lucide-react";
import { Link, Outlet } from "react-router";
import { ROUTES } from "../../../constants/routes";

export function AuthLayout({ children }) {
  return (
    <div className="bg-canvas flex min-h-screen flex-col justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link
            to={ROUTES.HOME}
            className="text-ink focus-visible:ring-primary-600 inline-flex items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="bg-primary-600 text-surface flex h-10 w-10 items-center justify-center rounded-md">
              <Sprout className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-h4 text-ink font-semibold tracking-tight">
              PasarTani
            </span>
          </Link>
        </div>

        <div className="border-border bg-surface rounded-lg border p-6 sm:p-8">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}
