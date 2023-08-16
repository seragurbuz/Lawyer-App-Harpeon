import { object, TypeOf, string } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateJobInput:
 *      type: object
 *      required:
 *        - description
 *        - end_date
 *      properties:
 *        description:
 *          type: string
 *          example: tazminat davasi
 *        end_date:
 *          type: string
 *          example: 2023-12-31
 *    CreateJobResponse:
 *      type: object
 *      properties:
 *        job_id:
 *          type: integer
 *        description:
 *          type: string
 *        start_date:
 *          type: string
 *        end_date:
 *          type: string
 *        job_state:
 *          type: string
 *        creator_lawyer_id:
 *          type: integer
 *        lawyer_id:
 *          type: integer
 *        created_at:
 *          type: string
 */

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

export const endJobSchema = object({
  params: object({
    job_id: string({
      required_error: " Job Id is required",
    }),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetJobResponse:
 *      type: object
 *      properties:
 *        job_id:
 *          type: integer
 *        description:
 *          type: string
 *        start_date:
 *          type: string
 *        end_date:
 *          type: string
 *        job_state:
 *          type: string
 *        creator_lawyer_id:
 *          type: integer
 *        lawyer_id:
 *          type: integer
 *        created_at:
 *          type: string
 */

export const getJobSchema = object({
  params: object({
    job_id: string({
      required_error: " Job Id is required",
    }),
  }),
});

export type CreateJobInput = TypeOf<typeof createJobSchema>;
export type EndJobInput = TypeOf<typeof endJobSchema>;
export type GetJobInput = TypeOf<typeof getJobSchema>;

