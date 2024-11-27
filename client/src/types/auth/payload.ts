import { registerSchema } from "@/validations/register";
import { z } from "zod";

export type RegisterPayload = z.infer<typeof registerSchema>;
