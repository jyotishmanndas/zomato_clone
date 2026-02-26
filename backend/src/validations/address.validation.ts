import { z } from "zod";

export const addressSchema = z.object({
    mobile: z.coerce.number(),
    formattedAddress: z.string(),
    location: z.object({
        type: z.literal("Point"),
        coordinates: z.tuple([
            z.number(),
            z.number()
        ]),
    })
})