import { useNavigate, useSearchParams } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { SearchBar } from "../components/SearchBar";
import { ProductGrid } from "../components/ProductGrid";
import { Pagination } from "../../../components/molecules/Pagination";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { Spinner } from "../../../components/atoms/Spinner";

function sanitizePage(pageParam, totalPages) {
  const parsed = parseInt(pageParam, 10);

  if (isNaN(parsed) || parsed < 1) {
    return 1;
  }

  if (totalPages > 0 && parsed > totalPages) {
    return totalPages;
  }

  return parsed;
}

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const pageParam = searchParams.get("page") || "1";

  const { data, isLoading, isError, error, refetch, isFetching } = useProducts({
    search: searchQuery,
    page: parseInt(pageParam, 10) || 1,
    limit: 12,
  });

  const products = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 12, total: 0, totalPages: 0 };

  // Sanitize page number after we know totalPages
  const actualPage = sanitizePage(pageParam, meta.totalPages);

  // Redirect if page was corrected
  if (actualPage !== parseInt(pageParam, 10) && meta.totalPages > 0) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(actualPage));
    setSearchParams(newParams, { replace: true });
  }

  const handleSearch = (keyword) => {
    const newParams = new URLSearchParams();
    if (keyword) {
      newParams.set("search", keyword);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  const isEmpty = !isLoading && products.length === 0;
  const isSearchEmpty = isEmpty && searchQuery;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h2 text-ink mb-6 font-semibold">
          {searchQuery ? `Hasil pencarian "${searchQuery}"` : "Katalog Produk"}
        </h1>

        <SearchBar
          defaultValue={searchQuery}
          onSearch={handleSearch}
          className="mx-auto max-w-2xl"
        />
      </div>

      {/* Loading Indicator (when refetching) */}
      {isFetching && !isLoading && (
        <div className="text-body-sm text-ink-soft mb-4 flex items-center justify-center gap-2">
          <Spinner className="h-4 w-4" />
          <span>Memuat produk...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Alert
          variant="error"
          title="Gagal memuat produk"
          action={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Coba lagi
            </Button>
          }
          className="mb-6"
        >
          {error?.message ||
            "Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi."}
        </Alert>
      )}

      {/* Product Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        isEmpty={isEmpty}
        onProductClick={handleProductClick}
        emptyMessage={
          isSearchEmpty
            ? `Produk "${searchQuery}" tidak ditemukan.`
            : "Belum ada produk tersedia."
        }
      />

      {/* Empty Search Actions */}
      {isSearchEmpty && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={handleClearSearch}>
            Lihat semua produk
          </Button>
        </div>
      )}

      {/* Pagination */}
      {!isEmpty && !isError && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          onChange={handlePageChange}
          className="mt-8"
        />
      )}
    </div>
  );
}
