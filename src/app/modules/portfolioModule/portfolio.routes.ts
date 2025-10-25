import express from 'express';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';
import portfolioControllers from './portfolio.controllers';

const portfolioRoutes = express.Router();

// Route to create or update About Us content (only accessible to admin or super-admin)
portfolioRoutes.put('/create', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), portfolioControllers.createPortfolio);
portfolioRoutes.get('/retrieve', portfolioControllers.getPortfolio);
portfolioRoutes.delete('/delete/:id', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), portfolioControllers.deletePortfolio)

export default portfolioRoutes;
