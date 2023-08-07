import { object, string, TypeOf } from "zod";

export const getCitiesSchema = object({
  city_name: string({
    required_error: "City name is required",
  }),
});

export type CreateCityInput = TypeOf<typeof getCitiesSchema>;
