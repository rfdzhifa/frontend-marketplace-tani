import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AlertCircle, Package, Plus, RefreshCw } from "lucide-react";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { Pagination } from "../../../components/molecules/Pagination";
import { ProductFilters } from "../components/ProductFilters";
import { ProductViewToggle } from "../components/ProductViewToggle";
import { SellerProductCard } from "../components/SellerProductCard";
import { SellerProductTable } from "../components/SellerProductTable";
import { StockUpdateDialog } from "../components/StockUpdateDialog";
import { DeleteProductDialog } from "../components/DeleteProductDialog";
import { useSellerProducts } from "../hooks/useSellerProducts";
import { useUpdateProductStock } from "../hooks/useUpdateProductStock";
import { useDeleteSellerProduct } from "../hooks/useDeleteSellerProduct";
import { ROUTES } from "../../../constants/routes";

function ProductsSkeleton({ view }) {
  if (view === "table") {
    return (
      <div className="border-border bg-surface space-y-4 rounded-md border p-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border-border bg-surface space-y-3 overflow-hidden rounded-md border p-3"
        >
          <Skeleton className="aspect-4/3 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-2 w-full" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SellerProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState("grid");

  // Dialog states
  const [stockDialog, setStockDialog] = useState({
    isOpen: false,
    product: null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    product: null,
  });

  // Query params
  const currentStatus = searchParams.get("status") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isPlaceholderData,
  } = useSellerProducts({
    status: currentStatus,
    page: currentPage,
    limit: 12,
  });

  const updateStockMutation = useUpdateProductStock();
  const deleteMutation = useDeleteSellerProduct();

  const products = responseData?.data || [];
  const meta = responseData?.meta || { page: 1, totalPages: 1, total: 0 };

  const handleStatusChange = (newStatus) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newStatus === "all") {
        next.delete("status");
      } else {
        next.set("status", newStatus);
      }
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

  const handleSaveStock = (newStock) => {
    if (!stockDialog.product) return;
    updateStockMutation.mutate(
      { id: stockDialog.product.id, stock: newStock },
      {
        onSuccess: () => {
          setStockDialog({ isOpen: false, product: null });
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog.product) return;
    deleteMutation.mutate(deleteDialog.product.id, {
      onSuccess: () => {
        setDeleteDialog({ isOpen: false, product: null });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 text-ink font-semibold">Produk Saya</h1>
          <p className="text-body-sm text-ink-soft mt-1">
            Kelola hasil panen, ketersediaan stok, dan informasi produk di
            etalase Anda.
          </p>
        </div>

        <Link to={ROUTES.SELLER_PRODUCT_NEW}>
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Tambah Produk</span>
          </Button>
        </Link>
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ProductFilters
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
        />

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-caption text-ink-muted">
            Total: <span className="text-ink font-semibold">{meta.total}</span>{" "}
            produk
          </span>
          <ProductViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading && !isPlaceholderData ? (
        <ProductsSkeleton view={view} />
      ) : isError ? (
        <Alert
          variant="error"
          title="Gagal memuat daftar produk"
          action={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              Coba lagi
            </Button>
          }
        >
          {error?.response?.data?.message ||
            "Terjadi kesalahan saat memuat daftar produk Anda. Silakan coba lagi."}
        </Alert>
      ) : products.length === 0 ? (
        <div className="border-border bg-surface rounded-md border p-12 text-center">
          <div className="bg-primary-50 text-primary-600 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            {currentStatus === "all" ? (
              <Package className="h-7 w-7" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-7 w-7" aria-hidden="true" />
            )}
          </div>
          {currentStatus === "all" ? (
            <div className="mx-auto max-w-md space-y-2">
              <h3 className="text-h4 text-ink font-semibold">
                Belum ada produk
              </h3>
              <p className="text-body-sm text-ink-soft">
                Anda belum menambahkan produk pertanian apa pun ke etalase Anda.
                Tambahkan produk pertama Anda sekarang!
              </p>
              <div className="pt-3">
                <Link to={ROUTES.SELLER_PRODUCT_NEW}>
                  <Button variant="primary" className="gap-2">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Tambah Produk Pertama</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-md space-y-2">
              <h3 className="text-h4 text-ink font-semibold">
                Tidak ada produk
              </h3>
              <p className="text-body-sm text-ink-soft">
                Tidak ditemukan produk dengan status filter{" "}
                <span className="text-ink font-semibold">
                  "{currentStatus === "available" ? "Tersedia" : "Stok habis"}"
                </span>
                .
              </p>
              <div className="pt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStatusChange("all")}
                >
                  Tampilkan Semua Produk
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <SellerProductCard
                  key={product.id}
                  product={product}
                  onOpenStock={(prod) =>
                    setStockDialog({ isOpen: true, product: prod })
                  }
                  onOpenDelete={(prod) =>
                    setDeleteDialog({ isOpen: true, product: prod })
                  }
                />
              ))}
            </div>
          ) : (
            <SellerProductTable
              products={products}
              onOpenStock={(prod) =>
                setStockDialog({ isOpen: true, product: prod })
              }
              onOpenDelete={(prod) =>
                setDeleteDialog({ isOpen: true, product: prod })
              }
            />
          )}

          {/* Pagination */}
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}

      {/* Dialogs */}
      <StockUpdateDialog
        isOpen={stockDialog.isOpen}
        onClose={() => setStockDialog({ isOpen: false, product: null })}
        product={stockDialog.product}
        onSave={handleSaveStock}
        isPending={updateStockMutation.isPending}
      />

      <DeleteProductDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, product: null })}
        product={deleteDialog.product}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
