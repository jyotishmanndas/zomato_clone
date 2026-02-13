import { z } from "zod";

export const googleLoginSchema = z.object({
    code: z.string().min(1)
});

export const roleSchema = z.object({
    role: z.enum(["customer", "rider", "seller"])
});