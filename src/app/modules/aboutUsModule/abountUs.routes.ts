import express from 'express';
import aboutUsControllers from './aboutUs.controllers';
import authorization from '../../middlewares/authorization';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const aboutUsRouter = express.Router();

// Route to create or update About Us content (only accessible to admin or super-admin)
aboutUsRouter.put('/create', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), authorization('super-admin', 'admin'), aboutUsControllers.createAbout);
aboutUsRouter.get('/retrieve', aboutUsControllers.getAboutUs);
// aboutUsRouter.patch('/update/:id', authorization('super-admin', 'admin'), aboutUsControllers.updateAbout);

export default aboutUsRouter;
