import express from 'express';
import contactUsControllers from './contactUs.controllers';
import authorization from '../../middlewares/authorization';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const contactUsRouter = express.Router();

// Route to create or update About Us content (only accessible to admin or super-admin)
contactUsRouter.put('/create', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), contactUsControllers.createContactUs);
contactUsRouter.get('/retrieve', contactUsControllers.getContactUs);

export default contactUsRouter;
