import { Request, Response, NextFunction } from 'express';
import UserModel from '../../models/user.model';
import CashoutModel from '../../models/cashout.model';

const cashout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        const authUser = res.locals.authUser;

        const minimumCashoutAmount = 500;

        if (data.cashoutType === 'unilevel') {
            if (Number(authUser.unilevelPoints) < minimumCashoutAmount) {
                return res.status(401).json({
                    code: 'LACK_OF_UNILEVEL_POINTS',
                    message: "You don't have enough unilevel points.",
                });
            }

            if (Number(authUser.unilevelPoints) < Number(data.cashoutAmount)) {
                return res.status(401).json({
                    code: 'LACK_OF_UNILEVEL_POINTS',
                    message: "You don't have enough unilevel points.",
                });
            }
        }

        if (data.cashoutType === 'repeat-purchase') {
            if (Number(authUser.repeatPurchasePoints) < minimumCashoutAmount) {
                return res.status(401).json({
                    code: 'LACK_OF_REPEAT_PURCHASE_POINTS',
                    message: "You don't have enough repeat-purchase points.",
                });
            }

            if (
                Number(authUser.repeatPurchasePoints) <
                Number(data.cashoutAmount)
            ) {
                return res.status(401).json({
                    code: 'LACK_OF_REPEAT_PURCHASE_POINTS',
                    message: "You don't have enough repeat-purchase points.",
                });
            }
        }

        const cashout = await CashoutModel.findOne({
            user: data.userId,
            status: 'pending',
        });

        if (cashout) {
            return res.status(401).json({
                code: 'STILL_HAS_PENDING_CASHOUT',
                message: 'You still has pending cashout.',
            });
        }

        const newCashout = await CashoutModel.create({
            user: data.userId,
            userUnilevelPoints: data.userUnilevelPoints,
            userRepeatPurchasePoints: data.userRepeatPurchasePoints,
            userMobileNo: data.userMobileNo,
            cashoutAmount: data.cashoutAmount,
            cashoutType: data.cashoutType,
            status: 'pending',
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
        });

        return res.json(newCashout);
    } catch (err) {
        return res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const unilevelCashouts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cashouts = await CashoutModel.find({
            cashoutType: 'unilevel',
        })
            .populate('user')
            .exec();

        return res.json(cashouts);
    } catch (err) {
        return res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const repeatPurchaseCashouts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cashouts = await CashoutModel.find({
            cashoutType: 'repeat-purchase',
        })
            .populate('user')
            .exec();

        return res.json(cashouts);
    } catch (err) {
        return res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const denyCashout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        const cashout = await CashoutModel.findOneAndUpdate(
            {
                _id: data.cashoutId,
            },
            {
                status: 'denied',
            }
        );

        return res.json(cashout);
    } catch (err) {
        return res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const confirmCashout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body;

        const cashout = await CashoutModel.findOneAndUpdate(
            {
                _id: data.cashoutId,
                cashoutType: data.cashoutType,
            },
            {
                status: 'confirmed',
            }
        );

        if (!cashout) {
            return res.status(401).json({
                error: {
                    message: 'Cannot find cashout id',
                    code: 'SERVER_ERROR',
                    error: null,
                },
                success: false,
            });
        }

        const user = await UserModel.findOne({ _id: cashout.user }).exec();

        if (!user) {
            return res.status(401).json({
                error: {
                    message: 'Cannot find cashout user',
                    code: 'SERVER_ERROR',
                    error: null,
                },
                success: false,
            });
        }

        let newUnilevelPoints = user.unilevelPoints;
        let newRepeatPurchasePoints = user.repeatPurchasePoints;

        if (cashout.cashoutType === 'unilevel') {
            newUnilevelPoints = newUnilevelPoints - cashout.cashoutAmount;
        }

        if (cashout.cashoutType === 'repeat-purchase') {
            newRepeatPurchasePoints =
                newRepeatPurchasePoints - cashout.cashoutAmount;
        }

        await UserModel.findOneAndUpdate(
            {
                _id: cashout.user,
            },
            {
                unilevelPoints: newUnilevelPoints,
                repeatPurchasePoints: newRepeatPurchasePoints,
            }
        );

        return res.json(cashout);
    } catch (err) {
        return res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const paidCashout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        const cashout = await CashoutModel.findOneAndUpdate(
            {
                _id: data.cashoutId,
            },
            {
                status: 'paid',
            }
        );

        return res.json(cashout);
    } catch (err) {
        return res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const unilevelCashoutsPerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cashouts = await CashoutModel.find({
            cashoutType: 'unilevel',
            user: req.params.userId,
        })
            .populate('user')
            .exec();

        return res.json(cashouts);
    } catch (err) {
        return res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

export default {
    cashout,
    unilevelCashouts,
    repeatPurchaseCashouts,
    denyCashout,
    confirmCashout,
    paidCashout,
    unilevelCashoutsPerUser,
};
