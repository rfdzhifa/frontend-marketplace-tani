import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, PackageCheck, PackagePlus } from "lucide-react";
import { Button } from "../../../components/atoms/Button";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { ProductForm } from "../components/ProductForm";
import { useSellerProduct } from "../hooks/useSellerProduct";
import { useCreateSellerProduct } from "../hooks/useCreateSellerProduct";
import { useUpdateSellerProduct } from "../hooks/useUpdateSellerProduct";
import { ROUTES } from "../../../constants/routes";

function FormSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="border-border flex justify-end gap-3 border-t pt-5">
        <Skeleton className="h-11 w-24" />
        <Skeleton className="h-11 w-36" />
      </div>
    </div>
  );
}

export default function SellerProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

  const {
    data: detailResponse,
    isLoading: isFetchingProduct,
    isError: isDetailError,
    error: detailError,
  } = useSellerProduct(productId);

  const createMutation = useCreateSellerProduct();
  const updateMutation = useUpdateSellerProduct();

  const isSaving = isEditMode
    ? updateMutation.isPending
    : createMutation.isPending;

  const currentMutation = isEditMode ? updateMutation : createMutation;
  const apiError = currentMutation.error;
  const errorMessage =
    apiError?.response?.data?.message ||
    (apiError?.request
      ? "Tidak dapat terhubung ke server. Periksa koneksi Anda."
      : "");
  const fieldErrors = apiError?.response?.data?.errors || [];

  const initialData = detailResponse?.data || null;

  const handleSubmit = (values) => {
    if (isEditMode) {
      updateMutation.mutate(
        { id: productId, payload: values },
        {
          onSuccess: () => {
            navigate(ROUTES.SELLER_PRODUCTS);
          },
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          navigate(ROUTES.SELLER_PRODUCTS);
        },
      });
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.SELLER_PRODUCTS);
  };

  // 404 Not Found state for edit mode
  if (isEditMode && isDetailError) {
    const is404 =
      detailError?.response?.status === 404 ||
      detailError?.response?.status === 400;

    return (
      <div className="space-y-6">
        <div>
          <Link
            to={ROUTES.SELLER_PRODUCTS}
            className="text-body-sm text-ink-soft hover:text-ink mb-3 inline-flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali ke Produk Saya</span>
          </Link>
        </div>

        <div className="border-border bg-surface mx-auto max-w-lg rounded-md border p-8 text-center">
          <p className="text-caption text-danger-600 font-semibold">
            {is404 ? "404 Not Found" : "Error"}
          </p>
          <h2 className="text-h3 text-ink mt-1 font-semibold">
            Produk tidak ditemukan
          </h2>
          <p className="text-body-sm text-ink-soft mt-2">
            Produk yang Anda cari tidak tersedia, sudah dihapus, atau bukan
            milik akun Anda.
          </p>
          <div className="mt-6">
            <Link to={ROUTES.SELLER_PRODUCTS}>
              <Button variant="primary">Kembali ke Daftar Produk</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link & Title */}
      <div>
        <Link
          to={ROUTES.SELLER_PRODUCTS}
          className="text-body-sm text-ink-soft hover:text-ink mb-3 inline-flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Produk Saya</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="bg-primary-100 text-primary-800 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm">
            {isEditMode ? (
              <PackageCheck className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PackagePlus className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
          <div>
            <h1 className="text-h2 text-ink font-semibold">
              {isEditMode ? "Ubah Produk" : "Tambah Produk Baru"}
            </h1>
            <p className="text-body-sm text-ink-soft">
              {isEditMode
                ? "Perbarui informasi produk dan harga di etalase Anda."
                : "Isi data produk hasil panen untuk dipasarkan ke pembeli."}
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="border-border bg-surface max-w-2xl rounded-md border p-6 sm:p-8">
        {isEditMode && isFetchingProduct ? (
          <FormSkeleton />
        ) : (
          <ProductForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            errorMessage={errorMessage}
            fieldErrors={fieldErrors}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
