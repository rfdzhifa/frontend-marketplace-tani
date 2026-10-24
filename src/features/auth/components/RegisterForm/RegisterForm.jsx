import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { Alert } from "../../../../components/atoms/Alert";
import { Button } from "../../../../components/atoms/Button";
import { FormField } from "../../../../components/molecules/FormField";
import { RoleSelector } from "../RoleSelector";
import { registerSchema } from "../../schemas/auth.schema";
import { ROLES } from "../../../../constants/roles";
import { ROUTES } from "../../../../constants/routes";

const REGISTER_FIELDS = ["name", "email", "phone", "password", "role"];

export function RegisterForm({
  onSubmit,
  isLoading = false,
  fieldErrors = [],
  statusCode = null,
  errorMessage = "",
}) {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: ROLES.BUYER,
    },
  });

  const selectedRole = useWatch({
    control,
    name: "role",
  });

  useEffect(() => {
    if (statusCode === 409) {
      setError("email", {
        type: "server",
        message: errorMessage || "Email sudah terdaftar",
      });
      return;
    }

    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      fieldErrors.forEach((item) => {
        if (item?.field && REGISTER_FIELDS.includes(item.field)) {
          setError(item.field, {
            type: "server",
            message: item.message,
          });
        }
      });
    }
  }, [fieldErrors, statusCode, errorMessage, setError]);

  const showGeneralAlert =
    Boolean(errorMessage) &&
    statusCode !== 409 &&
    (!Array.isArray(fieldErrors) || fieldErrors.length === 0);

  const handleFormSubmit = (values) => {
    clearErrors();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="space-y-5"
    >
      <div className="space-y-1">
        <h1 className="text-h3 text-ink font-semibold">Buat akun baru</h1>
        <p className="text-body-sm text-ink-soft">
          Pilih peran dan lengkapi data diri Anda untuk mulai bertransaksi.
        </p>
      </div>

      {showGeneralAlert && <Alert variant="error">{errorMessage}</Alert>}

      <RoleSelector
        value={selectedRole}
        disabled={isLoading}
        error={errors.role?.message}
        onChange={(nextRole) =>
          setValue("role", nextRole, { shouldValidate: true })
        }
      />

      <FormField
        id="register-name"
        label="Nama lengkap"
        isRequired
        placeholder="Contoh: Budi Santoso"
        autoComplete="name"
        disabled={isLoading}
        error={errors.name?.message}
        {...register("name")}
      />

      <FormField
        id="register-email"
        type="email"
        label="Email"
        isRequired
        placeholder="nama@email.com"
        autoComplete="email"
        disabled={isLoading}
        error={errors.email?.message}
        {...register("email")}
      />

      <FormField
        id="register-phone"
        type="tel"
        label="Nomor telepon"
        isRequired
        placeholder="081234567890"
        autoComplete="tel"
        helperText="Gunakan format nomor Indonesia (08..., 628..., atau +628...)"
        disabled={isLoading}
        error={errors.phone?.message}
        {...register("phone")}
      />

      <FormField
        id="register-password"
        type="password"
        label="Password"
        isRequired
        placeholder="Minimal 8 karakter huruf dan angka"
        autoComplete="new-password"
        helperText="Minimal 8 karakter, wajib mengandung huruf dan angka"
        disabled={isLoading}
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Daftar
      </Button>

      <p className="text-body-sm text-ink-soft text-center">
        Sudah punya akun?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary-600 hover:text-primary-700 font-semibold focus-visible:underline focus-visible:outline-none"
        >
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
