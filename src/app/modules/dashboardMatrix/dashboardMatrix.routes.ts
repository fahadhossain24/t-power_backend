import express from 'express';
import dashboardMatrixController from './dashboardMatrix.controller';

const dashboardMatricRouter = express.Router();

dashboardMatricRouter.get('/retrieve', dashboardMatrixController.retrieveDashboardMetrics);

export default dashboardMatricRouter;