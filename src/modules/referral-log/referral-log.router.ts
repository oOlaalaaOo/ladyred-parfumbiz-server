import express, { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import referralLogController from './referral-log.controller';

const referralLogRouter: Router = express.Router();

// admin routes
referralLogRouter
    .route('/:userId')
    .get(authMiddleware.isAuthorized, referralLogController.getLogs);

export default referralLogRouter;
