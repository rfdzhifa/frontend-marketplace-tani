import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "../../../components/atoms/Alert";
import { Button } from "../../../components/atoms/Button";
import { FormField } from "../../../components/molecules/FormField";
import { Textarea } from "../../../components/atoms/Textarea";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { farmerProfileSchema } from "../schemas/farmerProfile.schema";

const PROFILE_FIELDS = ["farmName", "description", "location", "photoUrl"];

export function FarmerProfileForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  fieldErrors = [],
  errorMessage = "",
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    control,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(farmerProfileSchema),
    defaultValues: {
      farmName: initialData?.farmName || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      photoUrl: initialData?.photoUrl || "",
    },
  });

  const photoUrlValue = useWatch({ control, name: "photoUrl" });

  useEffect(() => {
    reset({
      farmName: initialData?.farmName || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      photoUrl: initialData?.photoUrl || "",
    });
  }, [initialData, reset]);

  useEffect(() => {
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      fieldErrors.forEach((item) => {
        if (item?.field && PROFILE_FIELDS.includes(item.field)) {
          setError(item.field, {
            type: "server",
            message: item.message,
          });
        }
      });
    }
  }, [fieldErrors, setError]);

  const showGeneralAlert =
    Boolean(errorMessage) &&
    (!Array.isArray(fieldErrors) || fieldErrors.length === 0);

  const handleFormSubmit = (values) => {
    clearErrors();
    onSubmit({
      farmName: values.farmName,
      description: values.description,
      location: values.location,
      photoUrl: values.photoUrl ? values.photoUrl.trim() : "",
    });
  };

  const handleCancel = () => {
    clearErrors();
    reset({
      farmName: initialData?.farmName || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      photoUrl: initialData?.photoUrl || "",
    });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="space-y-5"
    >
      {showGeneralAlert && <Alert variant="error">{errorMessage}</Alert>}

      <FormField
        id="farmer-farm-name"
        label="Nama kebun / usaha tani"
        isRequired
        placeholder="mis. Kebun Sayur Sejahtera"
        disabled={isLoading}
        error={errors.farmName?.message}
        helperText="Nama usaha tani Anda yang akan ditampilkan kepada pembeli"
        {...register("farmName")}
      />

      <FormField
        id="farmer-location"
        label="Lokasi kebun"
        isRequired
        placeholder="mis. Lembang, Bandung Barat"
        disabled={isLoading}
        error={errors.location?.message}
        helperText="Daerah atau kota sentra kebun Anda"
        {...register("location")}
      />

      <FormField
        id="farmer-description"
        label="Deskripsi kebun"
        isRequired
        error={errors.description?.message}
        helperText="Ceritakan tentang metode bertani, komitmen kualitas, dan produk utama Anda (minimal 10 karakter)"
      >
        <Textarea
          id="farmer-description"
          rows={4}
          placeholder="Tuliskan cerita singkat tentang kebun dan hasil tani Anda..."
          disabled={isLoading}
          hasError={Boolean(errors.description)}
          {...register("description")}
        />
      </FormField>

      <div className="space-y-3">
        <FormField
          id="farmer-photo-url"
          type="url"
          label="URL foto profil / kebun"
          placeholder="https://example.com/foto-kebun.jpg"
          disabled={isLoading}
          error={errors.photoUrl?.message}
          helperText="Tautan langsung ke foto berformat JPG, PNG, atau WebP (opsional)"
          {...register("photoUrl")}
        />

        {photoUrlValue && !errors.photoUrl && (
          <div className="border-border bg-canvas flex items-center gap-4 rounded-md border p-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm">
              <ImageWithFallback
                src={photoUrlValue}
                alt="Pratinjau foto kebun"
                aspectRatio={1}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-caption text-ink-soft">
              <p className="text-ink font-semibold">Pratinjau foto</p>
              <p className="text-ink-muted line-clamp-1 break-all">
                {photoUrlValue}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border-border flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          disabled={
            isLoading || (!isDirty && !errorMessage && fieldErrors.length === 0)
          }
          onClick={handleCancel}
        >
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Simpan profil
        </Button>
      </div>
    </form>
  );
}
