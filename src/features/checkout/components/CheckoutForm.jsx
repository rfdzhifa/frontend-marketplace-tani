import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { checkoutSchema } from "../schemas/checkoutSchema";
import { FormField } from "../../../components/molecules/FormField";
import { Textarea } from "../../../components/atoms/Textarea";

export function CheckoutForm({
  formId = "checkout-form",
  defaultValues,
  onSubmit,
  disabled = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      namaPenerima: defaultValues?.namaPenerima || "",
      noTelepon: defaultValues?.noTelepon || "",
      alamatPengiriman: defaultValues?.alamatPengiriman || "",
      catatan: defaultValues?.catatan || "",
    },
  });

  useEffect(() => {
    if (defaultValues?.namaPenerima || defaultValues?.noTelepon) {
      reset((prev) => ({
        ...prev,
        namaPenerima: prev.namaPenerima || defaultValues.namaPenerima || "",
        noTelepon: prev.noTelepon || defaultValues.noTelepon || "",
      }));
    }
  }, [defaultValues?.namaPenerima, defaultValues?.noTelepon, reset]);

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="border-border bg-surface rounded-2xl border p-5 sm:p-6 space-y-5"
    >
      <div className="flex items-center gap-2.5 border-border border-b pb-4">
        <span className="bg-primary-50 text-primary-700 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-h4 font-semibold text-ink">Data Penerima & Pengiriman</h2>
          <p className="text-caption text-ink-muted">
            Pastikan alamat lengkap agar pesanan dapat diproses petani dengan tepat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="namaPenerima"
          label="Nama Penerima"
          isRequired
          placeholder="Contoh: Budi Santoso"
          disabled={disabled}
          error={errors.namaPenerima?.message}
          {...register("namaPenerima")}
        />

        <FormField
          id="noTelepon"
          label="Nomor Telepon"
          placeholder="Contoh: 081234567890"
          helperText="Opsional, format nomor Indonesia (08... / +628...)"
          disabled={disabled}
          error={errors.noTelepon?.message}
          {...register("noTelepon")}
        />
      </div>

      <FormField
        id="alamatPengiriman"
        label="Alamat Pengiriman"
        isRequired
        error={errors.alamatPengiriman?.message}
      >
        <Textarea
          id="alamatPengiriman"
          rows={3}
          placeholder="Jl. Merdeka No. 12, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132"
          disabled={disabled}
          hasError={Boolean(errors.alamatPengiriman)}
          {...register("alamatPengiriman")}
        />
      </FormField>

      <FormField
        id="catatan"
        label="Catatan untuk Petani"
        helperText="Opsional, maksimal 500 karakter"
        error={errors.catatan?.message}
      >
        <Textarea
          id="catatan"
          rows={2}
          placeholder="Contoh: Tolong pilih sayuran yang masih segar, titip di pos satpam"
          disabled={disabled}
          hasError={Boolean(errors.catatan)}
          {...register("catatan")}
        />
      </FormField>
    </form>
  );
}
