import { Link } from "react-router";
import { ExternalLink, Sprout } from "lucide-react";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { FarmerProfileForm } from "../components/FarmerProfileForm";
import { useAuth } from "../../auth";
import { useMyFarmerProfile } from "../hooks/useMyFarmerProfile";
import { useSaveFarmerProfile } from "../hooks/useSaveFarmerProfile";
import { getFarmerProfilePath } from "../../../constants/routes";

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
      : "Terjadi kesalahan saat menyimpan profil petani.");

  return { errorMessage, fieldErrors };
}

function FarmProfileSkeleton() {
  return (
    <div
      className="space-y-5"
      aria-busy="true"
      aria-label="Memuat data profil petani"
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="border-border flex justify-end gap-3 border-t pt-4">
        <Skeleton className="h-11 w-24" />
        <Skeleton className="h-11 w-36" />
      </div>
    </div>
  );
}

export default function FarmProfilePage() {
  const { user } = useAuth();
  const profileQuery = useMyFarmerProfile();
  const saveMutation = useSaveFarmerProfile();

  const farmerData = profileQuery.data;
  const { errorMessage, fieldErrors } = extractApiError(saveMutation.error);

  const publicProfilePath = user?.id ? getFarmerProfilePath(user.id) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-primary-100 text-primary-800 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Sprout className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-h2 text-ink font-semibold">
              Profil Usaha Tani
            </h1>
            <p className="text-body-sm text-ink-soft">
              Kelola profil kebun Anda agar pembeli dapat mengenal usaha tani
              Anda.
            </p>
          </div>
        </div>

        {publicProfilePath && (
          <Link
            to={publicProfilePath}
            target="_blank"
            rel="noreferrer"
            className="text-body-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5 self-start font-medium hover:underline sm:self-auto"
          >
            <span>Lihat Halaman Publik</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="border-border bg-surface max-w-3xl rounded-md border p-6 sm:p-8">
        {profileQuery.isLoading ? (
          <FarmProfileSkeleton />
        ) : profileQuery.isError ? (
          <Alert
            variant="error"
            title="Gagal memuat profil petani"
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
              "Data profil petani tidak dapat dimuat saat ini. Silakan coba lagi."}
          </Alert>
        ) : (
          <FarmerProfileForm
            initialData={farmerData}
            isLoading={saveMutation.isPending}
            errorMessage={errorMessage}
            fieldErrors={fieldErrors}
            onCancel={() => saveMutation.reset()}
            onSubmit={(values) => saveMutation.mutate(values)}
          />
        )}
      </div>
    </div>
  );
}
