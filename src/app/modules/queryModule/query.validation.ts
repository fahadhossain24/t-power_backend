import { z } from 'zod'

// Create Query Schema
const createQueryZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    contact: z.string({ required_error: 'Contact number is required' }),
    businessName: z.string().optional(),
    notes: z.string().optional(),
    isRead: z.boolean().optional(),

    productRef: z.string().optional(),
  }),
})

// Get Specific Query Schema
const getSpecificQueryZodSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Query ID is required in params!' }),
  }),
})

const QueryValidationZodSchema = {
  createQueryZodSchema,
  getSpecificQueryZodSchema,
}

export default QueryValidationZodSchema
