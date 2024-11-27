export type LoginResponse = {
  token: string;
};
export type RegisterResponse = LoginResponse & {
  message: string;
};
