import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { Textarea } from "../../../components/atoms/Textarea";
import { FormField } from "../../../components/molecules/FormField";
import {
  PRODUCT_UNITS,
  sellerProductSchema,
} from "../schemas/sellerProduct.schema";
import { formatRupiah } from "../../../utils/formatPrice";

export function ProductForm({
  initialData = null,
  onSubmit,
  isLoading = false,
  errorMessage = "",
  fieldErrors = [],
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sellerProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      unit: "kg",
      stock: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price ?? "",
        unit: initialData.unit || "kg",
        stock: initialData.stock ?? "",
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      fieldErrors.forEach((err) => {
        if (err.field && err.message) {
          setError(err.field, { message: err.message });
        }
      });
    }
  }, [fieldErrors, setError]);

  const watchedPrice = useWatch({ control, name: "price" });
  const watchedImageUrl = useWatch({ control, name: "imageUrl" });
  const numPrice = Number(watchedPrice);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <Alert variant="error" title="Gagal menyimpan produk">
          {errorMessage}
        </Alert>
      )}

      <div className="space-y-5">
        {/* Nama Produk */}
        <FormField
          id="product-name"
          label="Nama Produk"
          isRequired
          placeholder="Contoh: Cabai Merah Keriting Segar"
          error={errors.name?.message}
          helperText="Gunakan nama yang jelas dan spesifik agar mudah dicari pembeli."
          disabled={isLoading}
          {...register("name")}
        />

        {/* Harga & Satuan */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormField
              id="product-price"
              label="Harga Jual (Rp)"
              isRequired
              type="number"
              min="1"
              step="1"
              placeholder="Contoh: 35000"
              error={errors.price?.message}
              disabled={isLoading}
              {...register("price")}
            />
            {numPrice > 0 && (
              <p className="text-caption text-primary-700 flex items-center gap-1 font-semibold">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Pratinjau: {formatRupiah(numPrice)}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="product-unit"
              className="text-body-sm text-ink-soft block font-medium"
            >
              Satuan Produk <span className="text-danger-600">*</span>
            </label>
            <select
              id="product-unit"
              disabled={isLoading}
              className="bg-surface text-body text-ink border-border focus-visible:border-primary-600 focus-visible:ring-primary-100 disabled:bg-canvas disabled:text-ink-soft w-full rounded-sm border px-3.5 py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              {...register("unit")}
            >
              {PRODUCT_UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
            {errors.unit && (
              <p className="text-caption text-danger-600 font-medium">
                {errors.unit.message}
              </p>
            )}
          </div>
        </div>

        {/* Stok */}
        <FormField
          id="product-stock"
          label="Jumlah Stok Awal"
          isRequired
          type="number"
          min="0"
          step="1"
          placeholder="0"
          error={errors.stock?.message}
          helperText="Stok 0 akan menandai produk sebagai stok habis di katalog."
          disabled={isLoading}
          {...register("stock")}
        />

        {/* URL Foto Produk & Pratinjau */}
        <div className="space-y-2">
          <FormField
            id="product-imageUrl"
            label="URL Foto Produk"
            type="url"
            placeholder="https://images.unsplash.com/... atau tautan gambar langsung"
            error={errors.imageUrl?.message}
            helperText="Masukkan URL gambar valid (HTTP/HTTPS). Gunakan foto produk beresolusi baik dengan rasio 1:1."
            disabled={isLoading}
            {...register("imageUrl")}
          />

          {/* Image Preview Box */}
          <div className="border-border bg-canvas/60 mt-2 flex items-start gap-4 rounded-sm border p-3.5">
            <div className="border-border bg-media-bg h-20 w-20 shrink-0 overflow-hidden rounded-sm border">
              {watchedImageUrl ? (
                <ImageWithFallback
                  src={watchedImageUrl}
                  alt="Pratinjau foto produk"
                  aspectRatio={1}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-ink-muted flex h-full w-full flex-col items-center justify-center">
                  <ImageIcon
                    className="h-6 w-6 opacity-40"
                    aria-hidden="true"
                  />
                  <span className="text-ink-muted mt-1 text-[10px]">
                    Belum ada
                  </span>
                </div>
              )}
            </div>
            <div className="text-caption text-ink-soft space-y-1">
              <p className="text-ink font-semibold">Tips Foto Produk:</p>
              <ul className="text-caption text-ink-muted list-inside list-disc space-y-0.5">
                <li>Gunakan pencahayaan alami yang terang.</li>
                <li>Posisikan produk di tengah bingkai (rasio persegi).</li>
                <li>Pastikan gambar menampilkan produk hasil panen asli.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="space-y-1.5">
          <label
            htmlFor="product-description"
            className="text-body-sm text-ink-soft block font-medium"
          >
            Deskripsi Produk
          </label>
          <Textarea
            id="product-description"
            rows={4}
            placeholder="Jelaskan kualitas, kesegaran hasil panen, varietas, atau cara penyimpanan..."
            disabled={isLoading}
            hasError={Boolean(errors.description)}
            {...register("description")}
          />
          {errors.description ? (
            <p className="text-caption text-danger-600 font-medium">
              {errors.description.message}
            </p>
          ) : (
            <p className="text-caption text-ink-muted">
              Maksimal 1000 karakter.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-border flex items-center justify-end gap-3 border-t pt-5">
        <Button
          type="button"
          variant="secondary"
          disabled={isLoading}
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Simpan Produk
        </Button>
      </div>
    </form>
  );
}
