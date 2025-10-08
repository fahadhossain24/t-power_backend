import { Router } from 'express';
import NewsController from './newsCat.controllers';

const newsCatRouter = Router();

newsCatRouter.get('/retrieve/all', NewsController.retrieveAllNewsCategory);

export default newsCatRouter;