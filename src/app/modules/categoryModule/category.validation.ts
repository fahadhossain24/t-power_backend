import z from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required!'
    }),
    metaTitle: z.string({
      required_error: 'Meta Title is required!'
    }),
    metaDescription: z.string({
      required_error: 'Meta Description is required!'
    }),
    visibility: z.object({
      isActive: z.boolean().optional(),
      navbar: z.boolean().optional(),
      homepage: z.boolean().optional(),
    }).optional(),
  })
})

const getSpecificCategoryZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "id is missing in request params!"
    })
  })
})

const getSpecificCategorySlugZodSchema = z.object({
  params: z.object({
    slug: z.string({
      required_error: "slug is missing in request params!"
    })
  })
})

const CategoryValidationZodSchema = {
  createCategoryZodSchema,
  getSpecificCategoryZodSchema,
  getSpecificCategorySlugZodSchema,
}

export default CategoryValidationZodSchema
