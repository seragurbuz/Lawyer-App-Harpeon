import { object, string, TypeOf, number} from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: stringPassword123
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 */

export const loginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    }),
  })
});

/**
 * @openapi
 * components:
 *   schemas:
 *     VerificationInput:
 *       type: object
 *       required:
 *         - lawyer_id
 *         - verification_code
 *       properties:
 *         lawyer_id:
 *           type: integer
 *           example: 5
 *         verification_code:
 *           type: string
 *           example: 903c3604-e61c-4f43-975d-ec1a8c26f84a
 *     VerificationResponse:
 *       type: object 
 *       properties:
 *         message:
 *           type: string
 */

export const verifyEmailSchema = object({
  body: object({
    lawyer_id: number({
      required_error: "Lawyer ID is required",
    }),
    verification_code: string({
      required_error: "Verification code is required",
    }),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           example: john@example.com
 *     ForgotPasswordResponse:
 *       type: object 
 *       properties:
 *         message:
 *           type: string
 */

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
});

/**
* @openapi
* components:
*   schemas:
*     ResetPasswordInput:
*       type: object
*       required:
*         - lawyer_id
*         - password_reset_code
*         - password
*         - passwordConfirmation
*       properties:
*         lawyer_id:
*           type: integer
*           example: 5
*         password_reset_code:
*           type: string
*         password:
*           type: string
*           example: newPassword123
*         passwordConfirmation:
*           type: string
*           example: newPassword123
*     ResetPasswordResponse:
*       type: object 
*       properties:
*         message:
*           type: string
*/

export const resetPasswordSchema = object({
  body: object({
    lawyer_id: number({
      required_error: "Lawyer ID is required",
    }),
    password_reset_code: string({
      required_error: "Password reset code is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short - should be min 6 chars"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});


export type LoginInput = TypeOf<typeof loginSchema>;
export type VerifyEmailInput = TypeOf<typeof verifyEmailSchema>
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
