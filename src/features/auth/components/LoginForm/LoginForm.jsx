import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { Alert } from "../../../../components/atoms/Alert";
import { Button } from "../../../../components/atoms/Button";
import { FormField } from "../../../../components/molecules/FormField";
import { loginSchema } from "../../schemas/auth.schema";
import { ROUTES } from "../../../../constants/routes";

const LOGIN_FIELDS = ["email", "password"];

export function LoginForm({
  onSubmit,
  isLoading = false,
  fieldErrors = [],
  statusCode = null,
  errorMessage = "",
}) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      fieldErrors.forEach((item) => {
        if (item?.field && LOGIN_FIELDS.includes(item.field)) {
          setError(item.field, {
            type: "server",
            message: item.message,
          });
        }
      });
    }
  }, [fieldErrors, setError]);

  const alertMessage =
    statusCode === 401
      ? "Email atau password salah"
      : errorMessage && (!fieldErrors || fieldErrors.length === 0)
        ? errorMessage
        : "";

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
        <h1 className="text-h3 text-ink font-semibold">Masuk ke akun Anda</h1>
        <p className="text-body-sm text-ink-soft">
          Masukkan email dan password yang terdaftar untuk melanjutkan.
        </p>
      </div>

      {alertMessage && <Alert variant="error">{alertMessage}</Alert>}

      <FormField
        id="login-email"
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
        id="login-password"
        type="password"
        label="Password"
        isRequired
        placeholder="Masukkan password Anda"
        autoComplete="current-password"
        disabled={isLoading}
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Masuk
      </Button>

      <p className="text-body-sm text-ink-soft text-center">
        Belum punya akun?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="text-primary-600 hover:text-primary-700 font-semibold focus-visible:underline focus-visible:outline-none"
        >
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
