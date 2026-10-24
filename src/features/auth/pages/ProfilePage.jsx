import { Link } from "react-router";
import { ArrowLeft, LogOut, Sprout, User } from "lucide-react";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { ProfileForm } from "../components/ProfileForm";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { getRoleHomePath, ROLE_LABELS, ROLES } from "../../../constants/roles";

function extractApiError(error) {
  if (!error) {
    return { errorMessage: "", fieldErrors: [] };
  }
  const data = error.response?.data;
  const fieldErrors = Array.isArray(data?.errors) ? data.errors : [];
  const errorMessage =
    data?.message ||
    (error.request
      ? "Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi."
      : "Terjadi kesalahan saat menyimpan profil.");

  return { errorMessage, fieldErrors };
}

function ProfileSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Memuat profil">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="bg-media-bg h-4 w-20 animate-pulse rounded-sm" />
          <div className="bg-media-bg h-11 w-full animate-pulse rounded-sm" />
        </div>
        <div className="space-y-2">
          <div className="bg-media-bg h-4 w-24 animate-pulse rounded-sm" />
          <div className="bg-media-bg h-11 w-full animate-pulse rounded-sm" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-media-bg h-4 w-28 animate-pulse rounded-sm" />
        <div className="bg-media-bg h-11 w-full animate-pulse rounded-sm" />
      </div>
      <div className="space-y-2">
        <div className="bg-media-bg h-4 w-28 animate-pulse rounded-sm" />
        <div className="bg-media-bg h-11 w-full animate-pulse rounded-sm" />
      </div>
      <div className="border-border flex justify-end gap-3 border-t pt-4">
        <div className="bg-media-bg h-11 w-24 animate-pulse rounded-sm" />
        <div className="bg-media-bg h-11 w-40 animate-pulse rounded-sm" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const profileQuery = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const profileData = profileQuery.data || user;
  const isSeller = profileData?.role === ROLES.SELLER;
  const homePath = getRoleHomePath(profileData?.role);

  const { errorMessage, fieldErrors } = extractApiError(
    updateProfileMutation.error,
  );

  return (
    <div className="bg-canvas min-h-screen">
      <header className="border-border bg-surface border-b">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to={homePath}
              className="text-ink focus-visible:ring-primary-600 inline-flex items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span className="bg-primary-600 text-surface flex h-9 w-9 items-center justify-center rounded-sm">
                <Sprout className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-h4 text-ink font-semibold">PasarTani</span>
            </Link>
            {isSeller && (
              <span className="bg-primary-100 text-caption text-primary-800 rounded-full px-3 py-1 font-semibold">
                Panel Petani
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={homePath}
              className="text-body-sm text-ink-soft hover:text-ink inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">
                {isSeller ? "Ke Dashboard" : "Ke Beranda"}
              </span>
            </Link>

            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-primary-100 text-primary-800 flex h-12 w-12 items-center justify-center rounded-full">
              <User className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-h2 text-ink font-semibold">Profil Akun</h1>
              <p className="text-body-sm text-ink-soft">
                Kelola informasi nama lengkap dan nomor telepon akun{" "}
                {ROLE_LABELS[profileData?.role] || "Anda"}.
              </p>
            </div>
          </div>

          <div className="border-border bg-surface rounded-md border p-6 sm:p-8">
            {profileQuery.isLoading && !profileData ? (
              <ProfileSkeleton />
            ) : profileQuery.isError && !profileData ? (
              <Alert
                variant="error"
                title="Gagal memuat profil"
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => profileQuery.refetch()}
                  >
                    Coba lagi
                  </Button>
                }
              >
                {profileQuery.error?.response?.data?.message ||
                  "Data profil tidak dapat dimuat saat ini. Silakan coba lagi."}
              </Alert>
            ) : (
              <>
                {profileQuery.isError && (
                  <Alert
                    variant="warning"
                    className="mb-5"
                    action={
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => profileQuery.refetch()}
                      >
                        Muat ulang
                      </Button>
                    }
                  >
                    Menampilkan data sesi terakhir. Gagal menyinkronkan data
                    terbaru dari server.
                  </Alert>
                )}

                <ProfileForm
                  initialData={profileData}
                  isLoading={updateProfileMutation.isPending}
                  errorMessage={errorMessage}
                  fieldErrors={fieldErrors}
                  onCancel={() => updateProfileMutation.reset()}
                  onSubmit={(values) => updateProfileMutation.mutate(values)}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
