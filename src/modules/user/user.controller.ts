import { Request, Response, NextFunction } from 'express';
import UserModel from '../../models/user.model';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find({}).select('+username').exec();

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModel.findById(req.params.userId).exec();

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const getDirectDownlines = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await UserModel.find({
            referralCode: req.params.uniqueCode,
        }).exec();

        res.json(users);
    } catch (err) {
        res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: req.body.userId },
            {
                mobileNo: req.body.mobileNo,
                btcWallet: req.body.btcWallet,
                tbcWallet: req.body.tbcWallet,
                gcashNo: req.body.gcashNo,
                paymayaNo: req.body.paymayaNo,
            }
        );

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const checkUsernameAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body;

        const oldUser = await UserModel.findOne({
            username: data.username,
        }).exec();

        if (oldUser && oldUser !== null) {
            res.status(200).json({
                error: {
                    message: 'Username already exists.',
                    code: 'USERNAME_ALREADY_EXISTS',
                },
                success: false,
            });

            return;
        }

        res.status(200).json({
            message: 'Successfully get membership.',
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const checkUniqueCodeAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body;

        const user = await UserModel.findOne({
            uniqueCode: data.uniqueCode,
        }).exec();

        if (user && user !== null) {
            res.status(200).json({
                error: {
                    message: 'Unique code already exists.',
                    code: 'UNIQUE_CODE_ALREADY_EXISTS',
                },
                success: false,
            });

            return;
        }

        res.status(200).json({
            message: 'Successfully get membership.',
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            error: {
                message: 'Something went wrong on the server.',
                code: 'SERVER_ERROR',
                error: err,
            },
            success: false,
        });
    }
};

const checkIfReferralCodeExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body;

        const user = await UserModel.findOne({
            referralCode: data.referralCode,
        }).exec();

        if (user && user !== null) {
            res.status(200).json({
                message: 'Successfully get membership.',
                success: true,
            });

            return;
        }

        res.status(200).json({
            error: {
                message: "Referral code doesn't exists.",
                code: 'REFERRAL_CODE_DOESNT_EXISTS',
            },
            success: false,
        });
    } catch (err) {
        res.status(500).json({
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
    getUsers,
    getUser,
    getDirectDownlines,
    updateUser,
    checkUsernameAvailability,
    checkUniqueCodeAvailability,
    checkIfReferralCodeExists,
};
