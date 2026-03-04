import { z } from "zod";

export const updateOrderStatusSchema = z.object({
    status: z.enum(["accepted", "preparing", "ready_for_rider"])
});