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

export const createLawyerSchema = object({
  ...payload,
});

export const updateLawyerSchema = object({
  body: object({
    first_name: string().optional(),
    last_name: string().optional(),
    email: string().email("Not a valid email").optional(),
    bar_id: number().optional(),
    status: string().optional(),
    linkedin_url: string().optional(),
    description: string().optional(),
  })
})

export const getAvailableLawyersSchema = object({
  params: object({
    bar_id: number({
      required_error: "Bar ID is required",
    }),
  }),
});

export type CreateLawyerInput = TypeOf<typeof createLawyerSchema>;
export type UpdateLawyerInput = TypeOf<typeof updateLawyerSchema>;
export type GetAvailableLawyersByBarIdInput = TypeOf<typeof getAvailableLawyersSchema>;
