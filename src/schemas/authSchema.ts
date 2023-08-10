import { object, string, TypeOf, number} from "zod";

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

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
});

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

