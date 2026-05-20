import { LoginPayload, LoginResponse, SignupPayload, SignupResponse, User } from "../types/user";
import { ApiService } from "./api.service";

export const signup = (payload: SignupPayload): Promise<SignupResponse> => {
  return ApiService<SignupResponse, SignupPayload>({
    method: "POST",
    url: "/api/signup",
    payload,
  });
};

export const login = (payload: LoginPayload): Promise<LoginResponse> => {
  return ApiService<LoginResponse, LoginPayload>({
    method: "POST",
    url: "/api/login",
    payload,
  });
};

export const getUser = (): Promise<User> => {
  return ApiService<User>({ method: "GET", url: "/api/user" });
}

export const logout = (): Promise<void> => {
  return ApiService({ method: "POST", url: "/api/logout" });
}
