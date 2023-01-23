import express, { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import cashoutController from './cashout.controller';

const cashoutRouter: Router = express.Router();

cashoutRouter
    .route('/')
    .post(authMiddleware.isAuthorized, cashoutController.cashout);

cashoutRouter
    .route('/:userId/unilevel')
    .get(authMiddleware.isAuthorized, cashoutController.unilevelCashouts);

// admin routes
cashoutRouter
    .route('/unilevel')
    .get(
        authMiddleware.isAuthorizedAsAdmin,
        cashoutController.unilevelCashouts
    );
cashoutRouter
    .route('/repeat-purchase')
    .get(
        authMiddleware.isAuthorizedAsAdmin,
        cashoutController.repeatPurchaseCashouts
    );

cashoutRouter
    .route('/confirm')
    .post(authMiddleware.isAuthorizedAsAdmin, cashoutController.confirmCashout);

cashoutRouter
    .route('/deny')
    .post(authMiddleware.isAuthorizedAsAdmin, cashoutController.denyCashout);

cashoutRouter
    .route('/paid')
    .post(authMiddleware.isAuthorizedAsAdmin, cashoutController.paidCashout);

export default cashoutRouter;
