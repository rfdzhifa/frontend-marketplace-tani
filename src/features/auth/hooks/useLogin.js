import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { login as loginApi } from "../api/auth.api";
import { useAuth } from "./useAuth";
import { getRoleHomePath, ROLES } from "../../../constants/roles";

function isAuthorizedRedirect(path, role) {
  if (!path || typeof path !== "string" || !path.startsWith("/")) {
    return false;
  }
  if (path.startsWith("//") || path === "/login" || path === "/register") {
    return false;
  }
  if (path.startsWith("/seller") && role !== ROLES.SELLER) {
    return false;
  }
  const buyerOnlyPrefixes = ["/cart", "/checkout", "/orders"];
  if (
    buyerOnlyPrefixes.some((prefix) => path.startsWith(prefix)) &&
    role !== ROLES.BUYER
  ) {
    return false;
  }
  return true;
}

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (payload) => loginApi(payload),
    onSuccess: (response) => {
      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token && user) {
        login(token, user);
        toast.success(response?.message || "Login berhasil");

        const requestedRedirect =
          searchParams.get("redirect") || location.state?.from?.pathname;

        const targetPath = isAuthorizedRedirect(requestedRedirect, user.role)
          ? requestedRedirect
          : getRoleHomePath(user.role);

        navigate(targetPath, { replace: true });
      }
    },
  });
}
