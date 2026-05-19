export interface User {
  id: string;
  username?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignupPayload {
  usernameOrEmail: string;
  password?: string;
}

export type SignupResponse = User;

export type LoginPayload = SignupPayload;
export type LoginResponse = User;
