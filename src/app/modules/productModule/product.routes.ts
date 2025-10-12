import express from 'express';
import requestValidator from '../../middlewares/requestValidator';
import ProductControllers from './product.controllers';
import ProductValidationZodSchema from './product.validation';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const productRouter = express.Router();

productRouter.post(
    '/create',
    authentication(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    requestValidator(ProductValidationZodSchema.createProductZodSchema),
    ProductControllers.createProduct
);

productRouter.post(
    '/upload/files/:id',
    requestValidator(ProductValidationZodSchema.getSpecificProductZodSchema),
    ProductControllers.uploadFiles
);

productRouter.get(
    '/retrieve/all',
    requestValidator(ProductValidationZodSchema.retrieveAllProductsZodSchema),
    ProductControllers.retrieveAllProducts
);

productRouter.get(
    '/retrieve/:slug',
    requestValidator(ProductValidationZodSchema.retrieveSpecificProductZodSchema),
    ProductControllers.retrieveSpecificProduct
);

productRouter.patch(
    '/update/:id',
    requestValidator(ProductValidationZodSchema.getSpecificProductZodSchema),
    ProductControllers.updateSpecificProduct
);

productRouter.delete(
    '/delete/:id',
    requestValidator(ProductValidationZodSchema.getSpecificProductZodSchema),
    ProductControllers.deleteSpecificProduct
);

export default productRouter;
