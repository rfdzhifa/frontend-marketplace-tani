import { Navigate, Outlet } from "react-router";
import { Spinner } from "../../components/atoms/Spinner";
import { useAuth } from "../../features/auth";
import { getRoleHomePath } from "../../constants/roles";

export function GuestRoute({ children }) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return (
      <div className="bg-canvas flex min-h-screen items-center justify-center">
        <div className="text-body-sm text-ink-soft flex items-center gap-2.5">
          <Spinner className="text-primary-600 h-5 w-5" />
          <span>Memuat...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleHomePath(user?.role)} replace />;
  }

  return children || <Outlet />;
}
