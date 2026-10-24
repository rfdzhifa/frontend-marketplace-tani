import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "../../../../components/atoms/Alert";
import { Button } from "../../../../components/atoms/Button";
import { FormField } from "../../../../components/molecules/FormField";
import { profileSchema } from "../../schemas/auth.schema";
import { ROLE_LABELS } from "../../../../constants/roles";

const PROFILE_FIELDS = ["name", "phone"];

export function ProfileForm({
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
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      phone: initialData?.phone || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        phone: initialData.phone || "",
      });
    }
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
      name: values.name,
      phone: values.phone,
    });
  };

  const handleCancel = () => {
    clearErrors();
    reset({
      name: initialData?.name || "",
      phone: initialData?.phone || "",
    });
    if (onCancel) {
      onCancel();
    }
  };

  const roleLabel = ROLE_LABELS[initialData?.role] || initialData?.role || "-";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="space-y-5"
    >
      {showGeneralAlert && <Alert variant="error">{errorMessage}</Alert>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          id="profile-email"
          type="email"
          label="Email"
          value={initialData?.email || ""}
          readOnly
          disabled
          helperText="Email akun tidak dapat diubah"
        />

        <FormField
          id="profile-role"
          type="text"
          label="Peran akun"
          value={roleLabel}
          readOnly
          disabled
          helperText="Peran dipilih saat registrasi dan bersifat tetap"
        />
      </div>

      <FormField
        id="profile-name"
        label="Nama lengkap"
        isRequired
        placeholder="Masukkan nama lengkap"
        autoComplete="name"
        disabled={isLoading}
        error={errors.name?.message}
        {...register("name")}
      />

      <FormField
        id="profile-phone"
        type="tel"
        label="Nomor telepon"
        isRequired
        placeholder="081234567890"
        autoComplete="tel"
        helperText="Format nomor Indonesia (08..., 628..., atau +628...)"
        disabled={isLoading}
        error={errors.phone?.message}
        {...register("phone")}
      />

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
          Simpan perubahan
        </Button>
      </div>
    </form>
  );
}
