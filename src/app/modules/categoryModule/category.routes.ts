import express from 'express';
import requestValidator from '../../middlewares/requestValidator';
import CategoryControllers from './category.controllers';
import CategoryValidationZodSchema from './category.validation';

const categoryRouter = express.Router();

categoryRouter.post('/create', requestValidator(CategoryValidationZodSchema.createCategoryZodSchema), CategoryControllers.createCategory);
categoryRouter.get('/retrieve/all', CategoryControllers.retrieveAllCategory);
categoryRouter.get('/retrieve/products/with-categories', CategoryControllers.retrieveCategoriesWithSomeProducts)
categoryRouter.get(
  '/retrieve/:slug',
  requestValidator(CategoryValidationZodSchema.getSpecificCategorySlugZodSchema),
  CategoryControllers.retrieveSpecificCategory,
);
categoryRouter.patch(
  '/update/:id',
  requestValidator(CategoryValidationZodSchema.getSpecificCategoryZodSchema),
  CategoryControllers.updateSpecificCategory,
);
categoryRouter.delete(
  '/delete/:id',
  requestValidator(CategoryValidationZodSchema.getSpecificCategoryZodSchema),
  CategoryControllers.deleteSpecificCategory,
);


export default categoryRouter;
