import { Router } from 'express';
import NewsController from './news.controllers';

const newsRouter = Router();

newsRouter.post('/create', NewsController.createNews);
newsRouter.get('/retrieve/all', NewsController.getNews);
newsRouter.get('/retrieve/recent', NewsController.getRecentNews);
newsRouter.get('/retrieve/:id', NewsController.getNewsById);
newsRouter.get('/retrieve/slug/:slug', NewsController.getNewsBySlug);
newsRouter.patch('/update/:id', NewsController.updateNews);
newsRouter.delete('/delete/:id', NewsController.deleteNews);

export default newsRouter;