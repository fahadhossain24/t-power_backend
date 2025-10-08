import express from 'express';
import adminRouter from '../modules/adminModule/admin.routes';
import categoryRouter from '../modules/categoryModule/category.routes';
import newsRouter from '../modules/newsModule/news.routes';
import newsCatRouter from '../modules/newsCategoryModule/newsCat.routes';

const routersVersionOne = express.Router();

// user
routersVersionOne.use('/admin', adminRouter);

// application
routersVersionOne.use('/category', categoryRouter);
routersVersionOne.use('/news', newsRouter);
routersVersionOne.use('/newsCategory', newsCatRouter);

// settings

export default routersVersionOne;
