import { loginSchema } from "@/validations/login";
import { registerSchema } from "@/validations/register";
import { z } from "zod";

export type RegisterPayload = z.infer<typeof registerSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
