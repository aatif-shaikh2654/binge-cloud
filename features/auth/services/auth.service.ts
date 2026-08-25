import { ForgotPasswordPayload, LoginPayload, LoginResponse, ResetPasswordPayload, SignupPayload, SignupResponse, User } from "../types/user";
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

export const forgotPassword = (payload: ForgotPasswordPayload): Promise<{ message: string }> => {
  return ApiService<{ message: string }, ForgotPasswordPayload>({
    method: "POST",
    url: "/api/forgot-password",
    payload,
  });
}

export const resetPassword = (payload: ResetPasswordPayload): Promise<{ message: string }> => {
  return ApiService<{ message: string }, ResetPasswordPayload>({
    method: "POST",
    url: "/api/reset-password",
    payload,
  });
}
