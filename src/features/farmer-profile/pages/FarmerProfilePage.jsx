import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useFarmerProfile } from "../hooks/useFarmerProfile";
import { FarmerProfileHeader } from "../components/FarmerProfileHeader";
import { ProductGrid } from "../../marketplace";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { getProductDetailPath, ROUTES } from "../../../constants/routes";

function FarmerProfileSkeleton() {
  return (
    <div
      className="space-y-8"
      aria-busy="true"
      aria-label="Memuat profil petani"
    >
      <div className="border-border bg-surface rounded-md border p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Skeleton
            aspectRatio={1}
            className="h-24 w-24 rounded-md sm:h-28 sm:w-28"
          />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <ProductGrid isLoading skeletonCount={8} />
      </div>
    </div>
  );
}

export default function FarmerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useFarmerProfile(id);

  const farmer = data?.data;
  const is404 =
    error?.response?.status === 404 || error?.response?.status === 400;

  const handleProductClick = (productId) => {
    navigate(getProductDetailPath(productId));
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to={ROUTES.HOME}
          className="text-body-sm text-ink-soft hover:text-ink focus-visible:ring-primary-600 inline-flex items-center gap-2 font-medium focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke katalog</span>
        </Link>
      </div>

      {/* Loading state */}
      {isLoading && <FarmerProfileSkeleton />}

      {/* 404 Not Found state */}
      {!isLoading && is404 && (
        <div className="mx-auto max-w-2xl py-12 text-center">
          <Alert
            variant="error"
            title="Petani tidak ditemukan"
            className="text-left"
          >
            Profil petani yang Anda cari tidak tersedia atau belum terdaftar.
          </Alert>
          <div className="mt-6">
            <Link to={ROUTES.HOME}>
              <Button variant="primary">Kembali ke katalog</Button>
            </Link>
          </div>
        </div>
      )}

      {/* General Error state */}
      {!isLoading && isError && !is404 && (
        <div className="mx-auto max-w-2xl py-12">
          <Alert
            variant="error"
            title="Gagal memuat profil petani"
            action={
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Coba lagi
              </Button>
            }
          >
            {error?.message ||
              "Terjadi kesalahan saat memuat data profil petani."}
          </Alert>
        </div>
      )}

      {/* Success state */}
      {!isLoading && !isError && farmer && (
        <div>
          <FarmerProfileHeader farmer={farmer} />

          {/* Farmer Products Section */}
          <section className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-h3 text-ink sm:text-h2 font-semibold">
                Produk dari {farmer.farmName || farmer.name}
              </h2>
              {Array.isArray(farmer.products) && farmer.products.length > 0 && (
                <p className="text-body-sm text-ink-muted">
                  {farmer.products.length} produk tersedia
                </p>
              )}
            </div>

            <ProductGrid
              products={farmer.products || []}
              isEmpty={!farmer.products || farmer.products.length === 0}
              emptyMessage="Petani ini belum memiliki produk yang aktif."
              onProductClick={handleProductClick}
            />
          </section>
        </div>
      )}
    </div>
  );
}
