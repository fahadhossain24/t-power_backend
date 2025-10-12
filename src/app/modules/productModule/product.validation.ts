import z from 'zod';

const createProductZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required!' }),
    description: z.object({
      short: z.string({ required_error: 'Short description is required!' }),
      long: z.string().optional(),
    }),
    categories: z.array(z.string({ required_error: 'Each category must be a string ID.' })),
    tags: z.array(z.string()).optional(),
    price: z.number({ required_error: 'Price is required!' }),
    visibility: z.boolean().optional(),
    inStock: z.enum(['on', 'off']).optional(),
    sku: z.string().optional(),
    discount: z.object({
      fixedAmount: z.number().optional(),
      percentage: z.number().optional(),
    }).optional(),
    specification: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    ).optional(),
    meta: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }),
});

// Validation for a specific product by ID
const getSpecificProductZodSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Product ID is required in params!' }),
  }),
});

// Validation for product retrieval query filters
const retrieveAllProductsZodSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).refine(val => val > 0, { message: 'Page must be a positive number.' }),
    limit: z.string().transform(Number).refine(val => val > 0, { message: 'Limit must be a positive number.' }),
    search: z.string().optional(),
    visibility: z.enum(['true', 'false']).optional(),
    inStock: z.enum(['on', 'off']).optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    minPrice: z.string().transform(Number).optional(),
    maxPrice: z.string().transform(Number).optional(),
    category: z.string().optional(),
  }),
});

// Validation for product retrieval query filters
const retrieveSpecificProductZodSchema = z.object({
  params: z.object({
    slug: z.string({ required_error: 'Product slug is required in params!' }),
  }),
});

const ProductValidationZodSchema = {
  createProductZodSchema,
  getSpecificProductZodSchema,
  retrieveAllProductsZodSchema,
  retrieveSpecificProductZodSchema,
};

export default ProductValidationZodSchema;
