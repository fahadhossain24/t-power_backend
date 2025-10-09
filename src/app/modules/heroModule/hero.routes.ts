import express from 'express';
import heroControllers from './hero.controllers';
import authorization from '../../middlewares/authorization';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const heroRouter = express.Router();

// Route to create or update About Us content (only accessible to admin or super-admin)
heroRouter.put('/create', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), authorization('super-admin', 'admin'), heroControllers.createHero);
heroRouter.get('/retrieve', heroControllers.getHero);

export default heroRouter;
