import { object, number, TypeOf } from "zod";

export const ratingSchema = object({
    body: object ({
        rating: number().min(1).max(5),
    })
});

export type ratingInput = TypeOf<typeof ratingSchema>;
