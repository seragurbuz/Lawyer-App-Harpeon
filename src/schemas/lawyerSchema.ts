import { object, string, number, TypeOf } from "zod";

const payload = {
  body: object({
    first_name: string({
      required_error: "First name is required",
    }),
    last_name: string({
      required_error: "Last name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short - should be min 6 chars"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    bar_id: number({
      required_error: "Bar ID is required",
    }),
    status: string().optional().default("available"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateLawyerInput:
 *      type: object
 *      required:
 *        - first_name
 *        - last_name
 *        - password
 *        - passwordConfirmation
 *        - email
 *        - bar_id
 *      properties:
 *        first_name:
 *          type: string
 *          example: John
 *        last_name:
 *          type: string
 *          example: Smith
 *        password:
 *          type: string
 *          example: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          example: stringPassword123
 *        email:
 *          type: string
 *          example: john@example.com
 *        bar_id:
 *          type: integer
 *          example: 1
 *    CreateLawyerResponse:
 *      type: object
 *      properties:
 *        lawyer_id:
 *          type: integer
 *        first_name:
 *          type: string
 *        last_name:
 *          type: string
 *        email:
 *          type: string
 *        bar_id:
 *          type: integer
 *        status:
 *          type: string
 *        verified:
 *          type: boolean
 */

export const createLawyerSchema = object({
  ...payload,
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetLawyerProfileResponse:
 *      type: object
 *      properties:
 *        lawyer_id:
 *          type: integer
 *          example: 5
 *        first_name:
 *          type: string
 *          example: "John"
 *        last_name:
 *          type: string
 *          example: "Smith"
 *        email:
 *          type: string
 *          example: "john@example.com"
 *        bar_id:
 *          type: integer
 *          example: 1
 *        status:
 *          type: string
 *          example: "reserved"
 *        verified:
 *          type: booelan
 *          example: true
 *        linkedin_url:
 *          type: string
 *          example: "www.linkedin.com/in/sera-su-gürbüz-3775b3204"
 *        description:
 *          type: string
 *          example: "Experienced lawyer with a strong background in corporate law"
 *        star_rating:
 *          type: double
 *          example: 3.8
 */

export const getLawyerProfileSchema = object({
  params: object({
    lawyer_id: string({
      required_error: "Lawyer ID is required",
    }),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateLawyerInput:
 *      type: object
 *      properties:
 *        first_name:
 *          type: string
 *          example: John
 *        last_name:
 *          type: string
 *          example: Smith
 *        bar_id:
 *          type: integer
 *          example: 1
 *        status:
 *          type: string
 *          example: reserved
 *        linkedin_url:
 *          type: string
 *          example: www.linkedin.com/in/sera-su-gürbüz-3775b3204
 *        description:
 *          type: string
 *          example: Experienced lawyer with a strong background in corporate law
 */

export const updateLawyerSchema = object({
  body: object({
    first_name: string().optional(),
    last_name: string().optional(),
    bar_id: number().optional(),
    status: string().optional(),
    linkedin_url: string().optional(),
    description: string().optional(),
  })
})

/**
 * @openapi
 * components:
 *  schemas:
 *    GetLawyerLocationResponse:
 *      type: object
 *      properties:
 *        city_id:
 *          type: integer
 *        city_name:
 *          type: string
 *        bar_id:
 *          type: integer
 *        bar_name:
 *          type: string
 *    UpdateLawyerLocationInput:
 *      type: object
 *      required:
 *        - bar_name
 *      properties:
 *        bar_name:
 *          type: string
 *          example: Istanbul Barosu 1
 *    UpdateLawyerLocationResponse:
 *      type: object   
 *      properties:   
 *        message:
 *          type: string   
 */

export const updateLawyerLocationSchema = object({
  body: object({
    bar_name: string({
      required_error: "Bar name is required",
    }),
  }),
});

export type CreateLawyerInput = TypeOf<typeof createLawyerSchema>;
export type GetLawyerProfileInput = TypeOf<typeof getLawyerProfileSchema>;
export type UpdateLawyerInput = TypeOf<typeof updateLawyerSchema>;
export type UpdateLawyerLocationInput = TypeOf<typeof updateLawyerLocationSchema>;

