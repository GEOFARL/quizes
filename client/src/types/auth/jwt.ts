export type JwtPayload = {
  exp: number;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
};
