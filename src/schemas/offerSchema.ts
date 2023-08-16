import { object, number, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    MakeOfferInput:
 *      type: object
 *      required:
 *        - to_lawyer_id
 *        - job_id
 *      properties:
 *        to_lawyer_id:
 *          type: integer
 *          example: 1
 *        job_id:
 *          type: integer
 *          example: 3
 *    MakeOfferResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 */

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

  const params = {
    params: object({
      offer_id: string({
        required_error: "Offer ID is required",
      }),
    }),
  };

  /**
 * @openapi
 * components:
 *  schemas:
 *    AcceptOfferResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *    RejectOfferResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *    DeleteOfferResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *    GetSentOffersResponse:
 *      type: array
 *      items:
 *        type: object
 *        properties:
 *          offer_id:
 *            type: integer
 *          to_lawyer_id:
 *            type: integer
 *          job_id:
 *            type: integer
 *          state:
 *            type: string
 *          description:
 *            type: string
 *          end_date:
 *            type: string
 *    GetReceivedOffersResponse:
 *      type: array
 *      items:
 *        type: object
 *        properties:
 *          offer_id:
 *            type: integer
 *          from_lawyer_id:
 *            type: integer
 *          job_id:
 *            type: integer
 *          state:
 *            type: string
 *          description:
 *            type: string
 *          end_date:
 *            type: string
 */

  export const acceptOfferSchema = object({
    ...params,
  });

  export const rejectOfferSchema = object({
    ...params,
  });

  export const deleteOfferSchema = object({
    ...params,
  });

  export type MakeOfferInput = TypeOf<typeof makeOfferSchema>;
  export type AcceptOfferInput = TypeOf<typeof acceptOfferSchema>;
  export type RejectOfferInput = TypeOf<typeof rejectOfferSchema>;
  export type DeleteOfferInput = TypeOf<typeof deleteOfferSchema>;

