import express from 'express';
import adminRouter from '../modules/adminModule/admin.routes';
import categoryRouter from '../modules/categoryModule/category.routes';
import newsRouter from '../modules/newsModule/news.routes';
import newsCatRouter from '../modules/newsCategoryModule/newsCat.routes';
import subscriberRouter from '../modules/subscribeModule/subscriber.routes';
import adminAuthRouter from '../modules/adminAuthModule/auth.routes';

const routersVersionOne = express.Router();

// user
routersVersionOne.use('/admin', adminRouter);
routersVersionOne.use('/admin/auth', adminAuthRouter);

// application
routersVersionOne.use('/category', categoryRouter);
routersVersionOne.use('/news', newsRouter);
routersVersionOne.use('/newsCategory', newsCatRouter);
routersVersionOne.use('/subscriber', subscriberRouter);

// settings

export default routersVersionOne;
