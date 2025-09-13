import express from 'express';
import userControllers from './user.controllers';
import UserValidationZodSchema from './user.validation';
import requestValidator from '../../middlewares/requestValidator';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const userRouter = express.Router();


userRouter.post(
  '/create',
  requestValidator(UserValidationZodSchema.createUserZodSchema),
  userControllers.createUser
);
userRouter.get('/retrive/all', userControllers.getAllUser);

userRouter.get('/retrive/recent', userControllers.retrieveRecentUsers);

userRouter.get('/retrive/:id', requestValidator(UserValidationZodSchema.getSpecificUserZodSchema), userControllers.getSpecificUser);

userRouter.patch(
  '/update/:id',
  // authentication(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.PROVIDER),
  requestValidator(UserValidationZodSchema.getSpecificUserZodSchema),
  userControllers.updateSpecificUser,
);

// userRouter.delete(
//   '/delete/:id',
//   //   authentication('user', 'admin'),
//   requestValidator(UserValidationZodSchema.getSpecificUserZodSchema),
//   userControllers.deleteSpecificUser,
// );
userRouter.patch('/update/profile-picture/:id', authentication(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.PROVIDER), requestValidator(UserValidationZodSchema.getSpecificUserZodSchema), userControllers.changeUserProfileImage)


export default userRouter;
