import { SignupPayload, SignupResponse, LoginPayload, LoginResponse } from "../types/user";
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
