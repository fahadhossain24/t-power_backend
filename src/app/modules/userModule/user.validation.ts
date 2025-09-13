import z from 'zod';

const statusEnum = z.enum(['active', 'blocked', 'disabled'], {
  required_error: 'Status is required!',
  invalid_type_error: 'Invalid status type. Allowed values are active, blocked, or disabled.',
});

// Validation schema for user creation
const createUserZodSchema = z.object({
  body: z.object({
    fullName: z
      .string({
        required_error: 'Full name is required!',
      })
      .min(1, 'Full name must not be empty!'),

    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email('Invalid email address!'),

    password: z
      .string({
        required_error: 'Password is required!',
      })
      .min(8, 'Password must be at least 8 characters!'),

    isEmailVerified: z.boolean().optional().default(false),

    status: statusEnum.optional().default('active'),

    verification: z
      .object({
        code: z.string().nullable().optional(),
        expireDate: z.date().nullable().optional(),
      })
      .optional(),

    fcmToken: z.string().nullable().optional(),
  }),
});

// Validation schema for fetching a specific user by ID
const getSpecificUserZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'User ID is missing in request params!',
    }),
  }),
});

const UserValidationZodSchema = {
  createUserZodSchema,
  getSpecificUserZodSchema,
};

export default UserValidationZodSchema;
