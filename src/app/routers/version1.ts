import express from 'express';
import adminRouter from '../modules/adminModule/admin.routes';
import categoryRouter from '../modules/categoryModule/category.routes';

const routersVersionOne = express.Router();

// user
routersVersionOne.use('/admin', adminRouter);

// category
routersVersionOne.use('/category', categoryRouter);

// settings

export default routersVersionOne;
