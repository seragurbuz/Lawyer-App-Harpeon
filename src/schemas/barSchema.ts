import { object, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    GetBarsResponse:
 *      type: array
 *      items:
 *        type: object
 *        properties:
 *          bar_id:
 *            type: integer
 *            example: 1
 *          bar_name:
 *            type: string
 *            example: "Istanbul Barosu 1"
 *          city_id:
 *            type: integer
 *            example: 1
 */

export const getBarsByCityIdSchema = object({
    params: object({
        city_id: string({
          required_error: " City Id is required",
        }),
      }),
});

export type GetBarsByCityIdInput = TypeOf<typeof getBarsByCityIdSchema>;
