import express from 'express';
import referralLogRouter from './modules/referral-log/referral-log.router';
import authRouter from './modules/auth/auth.router';
import cashoutRouter from './modules/cashout/cashout.router';
import uniqueCodeRouter from './modules/unique-code/unique-code.router';
import userRouter from './modules/user/user.router';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/unique-code', uniqueCodeRouter);
router.use('/user', userRouter);
router.use('/referral-log', referralLogRouter);
router.use('/cashout', cashoutRouter);

export default router;
