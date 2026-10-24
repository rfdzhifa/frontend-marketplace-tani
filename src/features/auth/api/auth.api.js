import { httpClient } from "../../../services/httpClient";

export async function register(payload) {
  const response = await httpClient.post("/auth/register", {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    role: payload.role,
  });
  return response.data;
}

export async function login(payload) {
  const response = await httpClient.post("/auth/login", {
    email: payload.email,
    password: payload.password,
  });
  return response.data;
}

export async function getProfile() {
  const response = await httpClient.get("/auth/profile");
  return response.data;
}

export async function updateProfile(payload) {
  const response = await httpClient.put("/auth/profile", {
    name: payload.name,
    phone: payload.phone,
  });
  return response.data;
}
