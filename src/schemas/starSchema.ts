import { object, number, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    RatingInput:
 *      type: object
 *      required:
 *        - rating
 *      properties:
 *        rating:
 *          type: integer
 *          minimum: 1
 *          maximum: 5
 *          example: 3
 *    RatingResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 */

export const ratingSchema = object({
    body: object ({
        rating: number().min(1).max(5),
    })
});

export type ratingInput = TypeOf<typeof ratingSchema>;
