import express from 'express';
import adminRouter from '../modules/adminModule/admin.routes';

const routersVersionOne = express.Router();

// user
routersVersionOne.use('/admin', adminRouter);

// settings

export default routersVersionOne;
