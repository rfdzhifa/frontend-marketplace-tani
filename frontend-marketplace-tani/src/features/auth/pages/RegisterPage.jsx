import { RegisterForm } from "../components/RegisterForm";
import { useRegister } from "../hooks/useRegister";

function extractApiError(error) {
  if (!error) {
    return { statusCode: null, errorMessage: "", fieldErrors: [] };
  }
  const statusCode = error.response?.status || null;
  const data = error.response?.data;
  const fieldErrors = Array.isArray(data?.errors) ? data.errors : [];
  const errorMessage =
    data?.message ||
    (error.request
      ? "Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi."
      : "Terjadi kesalahan saat mendaftarkan akun.");

  return { statusCode, errorMessage, fieldErrors };
}

export default function RegisterPage() {
  const registerMutation = useRegister();
  const { statusCode, errorMessage, fieldErrors } = extractApiError(
    registerMutation.error,
  );

  return (
    <RegisterForm
      onSubmit={(values) => registerMutation.mutate(values)}
      isLoading={registerMutation.isPending}
      statusCode={statusCode}
      errorMessage={errorMessage}
      fieldErrors={fieldErrors}
    />
  );
}
