import { ROUTES } from "./routes";

export const ROLES = {
  BUYER: "BUYER",
  SELLER: "SELLER",
};

export const ROLE_LABELS = {
  [ROLES.BUYER]: "Pembeli",
  [ROLES.SELLER]: "Petani / Penjual",
};

export function getRoleHomePath(role) {
  if (role === ROLES.SELLER) {
    return ROUTES.SELLER_DASHBOARD;
  }
  return ROUTES.HOME;
}
