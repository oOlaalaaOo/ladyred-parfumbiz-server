import express, { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import uniqueCodeController from './unique-code.controller';

const uniqueCodeRouter: Router = express.Router();

// admin routes
// uniqueCodeRouter.route('/prefill').get(
//     // authMiddleware.isAuthorizedAsAdmin,
//     uniqueCodeController.prefillUniqueCodes
// );

uniqueCodeRouter
    .route('/')
    .get(authMiddleware.isAuthorizedAsAdmin, uniqueCodeController.uniqueCodes);

export default uniqueCodeRouter;
