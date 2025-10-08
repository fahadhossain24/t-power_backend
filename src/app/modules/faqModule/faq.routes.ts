import express from 'express';
import faqControllers from './faq.controllers';
import authorization from '../../middlewares/authorization';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const faqRouter = express.Router();

// Route to create new faq (only accessible to admin or super-admin)
faqRouter.post('/create', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), faqControllers.createNewFaq);

// Route to retrieve faq (accessible to everyone)
faqRouter.get('/retrieve', faqControllers.getAllFaq);

// Route to delete specific faq (only accessible to admin or super-admin)
faqRouter.delete('/delete/:id', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), faqControllers.deleteSpecificFaq);

// route for updated specific faq
faqRouter.patch('/update/:id', authentication(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), faqControllers.updateSpecificFaq);

export default faqRouter;
