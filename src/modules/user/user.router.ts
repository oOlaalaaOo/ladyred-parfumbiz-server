import express, { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import userController from './user.controller';

const userRouter: Router = express.Router();

// admin routes
userRouter
    .route('/')
    .get(authMiddleware.isAuthorizedAsAdmin, userController.getUsers);

userRouter
    .route('/:userId')
    .get(authMiddleware.isAuthorized, userController.getUser);

userRouter
    .route('/:uniqueCode/direct-downlines')
    .get(authMiddleware.isAuthorized, userController.getDirectDownlines);

userRouter
    .route('/update')
    .post(authMiddleware.isAuthorized, userController.updateUser);

userRouter
    .route('/username/check')
    .post(userController.checkUsernameAvailability);

userRouter
    .route('/unique-code/check')
    .post(userController.checkUniqueCodeAvailability);

userRouter
    .route('/referral-code/check')
    .post(userController.checkIfReferralCodeExists);

export default userRouter;
