import { object, date, TypeOf, string, number } from "zod";

export const createJobSchema = object({
  body: object({
    description: string({
      required_error: "Description is required",
    }),
    end_date: string({
      required_error: "End date is required",
    })
  }),
});

export type CreateJobInput = TypeOf<typeof createJobSchema>;
