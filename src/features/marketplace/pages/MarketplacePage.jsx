import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { SlidersHorizontal } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import {
  HeroSection,
  CategoryChips,
  BentoPromoGrid,
  ProductFilterSidebar,
  ActiveFilterChips,
  SearchBar,
  ProductGrid,
} from "../components";
import { MARKETPLACE_CATEGORIES } from "../constants/categories";
import { Pagination } from "../../../components/molecules/Pagination";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { Spinner } from "../../../components/atoms/Spinner";

const SORT_OPTIONS = [
  { value: "relevansi", label: "Paling Sesuai" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
  { value: "rating_desc", label: "Rating Tertinggi" },
];

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const inStockParam = searchParams.get("inStock") === "true";
  const sortParam = searchParams.get("sort") || "relevansi";
  const pageParam = searchParams.get("page") || "1";

  const { data, isLoading, isError, error, refetch, isFetching } = useProducts({
    search: searchQuery,
    category: categoryParam,
    page: parseInt(pageParam, 10) || 1,
    limit: 12,
  });

  const rawProducts = useMemo(() => data?.data || [], [data?.data]);
  const meta = data?.meta || { page: 1, limit: 12, total: 0, totalPages: 0 };

  // Apply client-side faceted filters (price range, stock availability) and sorting
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    const minVal = minPriceParam !== "" ? Number(minPriceParam) : null;
    const maxVal = maxPriceParam !== "" ? Number(maxPriceParam) : null;

    if (minVal !== null && !Number.isNaN(minVal)) {
      list = list.filter((p) => Number(p.price) >= minVal);
    }
    if (maxVal !== null && !Number.isNaN(maxVal)) {
      list = list.filter((p) => Number(p.price) <= maxVal);
    }
    if (inStockParam) {
      list = list.filter((p) => Boolean(p.isAvailable));
    }

    if (sortParam === "price_asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortParam === "price_desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortParam === "rating_desc") {
      list.sort((a, b) => Number(b.avgRating || 0) - Number(a.avgRating || 0));
    }

    return list;
  }, [rawProducts, minPriceParam, maxPriceParam, inStockParam, sortParam]);

  // Sanitize page number after we know totalPages
  const actualPage = sanitizePage(pageParam, meta.totalPages);

  // Redirect if page was corrected
  if (actualPage !== parseInt(pageParam, 10) && meta.totalPages > 0) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(actualPage));
    setSearchParams(newParams, { replace: true });
  }

  const updateParams = (mutator) => {
    const newParams = new URLSearchParams(searchParams);
    mutator(newParams);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSearch = (keyword) => {
    updateParams((params) => {
      if (keyword) {
        params.set("search", keyword);
      } else {
        params.delete("search");
      }
    });
  };

  const handleCategoryChange = (catValue) => {
    updateParams((params) => {
      if (catValue) {
        params.set("category", catValue);
      } else {
        params.delete("category");
      }
    });
  };

  const handleApplyPriceRange = ({ minPrice, maxPrice }) => {
    updateParams((params) => {
      if (minPrice) {
        params.set("minPrice", minPrice);
      } else {
        params.delete("minPrice");
      }
      if (maxPrice) {
        params.set("maxPrice", maxPrice);
      } else {
        params.delete("maxPrice");
      }
    });
  };

  const handleToggleInStock = (checked) => {
    updateParams((params) => {
      if (checked) {
        params.set("inStock", "true");
      } else {
        params.delete("inStock");
      }
    });
  };

  const handleSortChange = (e) => {
    const nextSort = e.target.value;
    updateParams((params) => {
      if (nextSort && nextSort !== "relevansi") {
        params.set("sort", nextSort);
      } else {
        params.delete("sort");
      }
    });
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
    const catalogElement = document.getElementById("catalog-section");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const activeCategory = MARKETPLACE_CATEGORIES.find(
    (c) => c.value === categoryParam && c.value !== "",
  );

  const headingText = searchQuery
    ? `Hasil pencarian "${searchQuery}"`
    : activeCategory
      ? `Kategori: ${activeCategory.label}`
      : "Katalog Produk";

  const hasAnyFilter = Boolean(
    searchQuery ||
      categoryParam ||
      minPriceParam ||
      maxPriceParam ||
      inStockParam,
  );
  const isEmpty = !isLoading && filteredProducts.length === 0;
  const isFilterEmpty = isEmpty && hasAnyFilter;

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-10">
      {/* Hero Banner */}
      <HeroSection />

      {/* Quick Category Chips */}
      <CategoryChips
        selectedCategory={categoryParam}
        onSelectCategory={handleCategoryChange}
      />

      {/* Natrix-Style Asymmetric Photo Bento Highlights */}
      <BentoPromoGrid onSelectCategory={handleCategoryChange} />

      {/* Catalog Section */}
      <section id="catalog-section" className="space-y-6 pt-2">
        {/* Header & Search Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-harvest-lime/30 bg-harvest-lime-soft/70 px-3 py-1 text-caption font-semibold text-primary-800">
              <span
                className="h-1.5 w-1.5 rounded-full bg-harvest-lime"
                aria-hidden="true"
              />
              Eksplorasi Hasil Bumi
            </span>
            <h2 className="text-h2 font-semibold text-ink">{headingText}</h2>
            <p className="text-body-sm text-ink-soft">
              Pilih komoditas panen terbaik langsung dari petani lokal terverifikasi.
            </p>
          </div>

          <SearchBar
            key={searchQuery}
            defaultValue={searchQuery}
            onSearch={handleSearch}
            className="w-full sm:max-w-md"
          />
        </div>

        {/* Mobile Filter Toggle & Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsMobileFilterOpen((prev) => !prev)}
              aria-expanded={isMobileFilterOpen}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              <span>Filter</span>
            </Button>
            <p className="text-body-sm text-ink-soft tabular">
              Menampilkan{" "}
              <span className="font-semibold text-ink">
                {filteredProducts.length}
              </span>{" "}
              produk
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="catalog-sort"
              className="text-body-sm font-medium text-ink-soft"
            >
              Urutkan:
            </label>
            <select
              id="catalog-sort"
              value={sortParam}
              onChange={handleSortChange}
              className="h-9 rounded-xl border border-border bg-surface px-3 text-body-sm font-medium text-ink focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Collapsible Filter Panel */}
        {isMobileFilterOpen && (
          <div className="lg:hidden">
            <ProductFilterSidebar
              selectedCategory={categoryParam}
              minPrice={minPriceParam}
              maxPrice={maxPriceParam}
              inStockOnly={inStockParam}
              onSelectCategory={handleCategoryChange}
              onApplyPriceRange={handleApplyPriceRange}
              onToggleInStock={handleToggleInStock}
              onResetFilters={handleClearFilters}
            />
          </div>
        )}

        {/* 2-Column Explore Faceted Catalog Layout */}
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
          {/* Desktop Left Sidebar */}
          <div className="hidden lg:block lg:sticky lg:top-24">
            <ProductFilterSidebar
              selectedCategory={categoryParam}
              minPrice={minPriceParam}
              maxPrice={maxPriceParam}
              inStockOnly={inStockParam}
              onSelectCategory={handleCategoryChange}
              onApplyPriceRange={handleApplyPriceRange}
              onToggleInStock={handleToggleInStock}
              onResetFilters={handleClearFilters}
            />
          </div>

          {/* Right Column: Active Filter Chips + Product Grid + Pagination */}
          <div className="space-y-5">
            <ActiveFilterChips
              searchQuery={searchQuery}
              selectedCategory={categoryParam}
              minPrice={minPriceParam}
              maxPrice={maxPriceParam}
              inStockOnly={inStockParam}
              onRemoveSearch={() => handleSearch("")}
              onRemoveCategory={() => handleCategoryChange("")}
              onRemovePriceRange={() =>
                handleApplyPriceRange({ minPrice: "", maxPrice: "" })
              }
              onRemoveInStock={() => handleToggleInStock(false)}
              onClearAll={handleClearFilters}
            />

            {/* Loading Indicator (when refetching) */}
            {isFetching && !isLoading && (
              <div className="flex items-center justify-center gap-2 py-2 text-body-sm text-ink-soft">
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
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => refetch()}
                  >
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
              products={filteredProducts}
              isLoading={isLoading}
              isEmpty={isEmpty}
              onProductClick={handleProductClick}
              className="lg:grid-cols-3"
              emptyMessage={
                searchQuery
                  ? `Produk "${searchQuery}" tidak ditemukan.`
                  : activeCategory
                    ? `Belum ada produk untuk kategori "${activeCategory.label}".`
                    : hasAnyFilter
                      ? "Tidak ada produk yang sesuai dengan filter Anda."
                      : "Belum ada produk tersedia."
              }
            />

            {/* Empty Search / Filter Actions */}
            {isFilterEmpty && (
              <div className="mt-6 flex justify-center">
                <Button variant="secondary" onClick={handleClearFilters}>
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
        </div>
      </section>
    </div>
  );
}
