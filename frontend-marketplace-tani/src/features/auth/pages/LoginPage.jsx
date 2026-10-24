import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

function extractApiError(error) {
  if (!error) {
    return { statusCode: null, errorMessage: "", fieldErrors: [] };
  }
  const statusCode = error.response?.status || null;
  const data = error.response?.data;
  const fieldErrors = Array.isArray(data?.errors) ? data.errors : [];
  const errorMessage =
    statusCode === 401
      ? "Email atau password salah"
      : data?.message ||
        (error.request
          ? "Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi."
          : "Terjadi kesalahan saat masuk ke akun.");

  return { statusCode, errorMessage, fieldErrors };
}

export default function LoginPage() {
  const loginMutation = useLogin();
  const { statusCode, errorMessage, fieldErrors } = extractApiError(
    loginMutation.error,
  );

  return (
    <LoginForm
      onSubmit={(values) => loginMutation.mutate(values)}
      isLoading={loginMutation.isPending}
      statusCode={statusCode}
      errorMessage={errorMessage}
      fieldErrors={fieldErrors}
    />
  );
}
