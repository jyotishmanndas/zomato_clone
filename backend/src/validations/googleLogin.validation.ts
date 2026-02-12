import {z} from "zod";

export const googleLoginSchema = z.object({
    code: z.string().min(1)
});