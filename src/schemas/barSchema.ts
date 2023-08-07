import { object, number, TypeOf } from 'zod';

export const getBarsByCityIdSchema = object({
    params: object({
        city_id: number({
          required_error: " City Id is required",
        }),
      }),
});

export type GetBarsByCityIdInput = TypeOf<typeof getBarsByCityIdSchema>;
