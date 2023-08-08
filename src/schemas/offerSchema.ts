import { object, number, string, TypeOf } from "zod";

export const makeOfferSchema = object({
    body: object({
      to_lawyer_id: number({
        required_error: "To lawyer ID is required",
      }),
      state: string().optional().default('waiting'),
      job_id: number({
        required_error: "Job ID is required",
      }),
    }),
  });

  export type MakeOfferInput = TypeOf<typeof makeOfferSchema>;
