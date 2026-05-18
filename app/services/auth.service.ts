import { SignupPayload, SignupResponse } from "../types/user";
import { ApiService } from "./api.service";

export const signup = (payload: SignupPayload): Promise<SignupResponse> => {
  return ApiService<SignupResponse, SignupPayload>({
    method: "POST",
    url: "/api/signup",
    payload,
  });
};
