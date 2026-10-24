import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { register as registerApi } from "../api/auth.api";
import { ROUTES } from "../../../constants/routes";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload) => registerApi(payload),
    onSuccess: (response) => {
      toast.success(response?.message || "Registrasi berhasil");
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
}
