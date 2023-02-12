import { Request, Response, NextFunction } from 'express';
import bcryptService from '../../services/bcrypt.service';
import jwtService from '../../services/jwt.service';
import UserModel, { IUser } from '../../models/user.model';
import { formatUser } from '../../utils/data-transformer.util';
import AdminModel from '../../models/admin.model';
import UniqueCodeModel from '../../models/unique-code.model';
import ReferralLogModel from '../../models/referral-log.model';

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        const user = await UserModel.findOne({
            username: data.username,
        }).exec();

        if (!user || user == null) {
            return res.status(401).json({
                error: {
                    message: 'Username and password did not matched.',
                    code: 'USER_NOT_FOUND',
                },
                success: false,
            });
        }

        if (user && user.password) {
            if (!bcryptService.verifyHashString(data.password, user.password)) {
                return res.status(401).json({
                    error: {
                        message: 'Username and password did not matched.',
                        code: 'INVALID_CREDENTIALS',
                    },
                    success: false,
                });
            }
        }

        const jwtPayload = {
            _id: user?._id,
            isAdmin: false,
        };

        const accessToken = jwtService.signPayload(jwtPayload);

        return res.json({
            message: 'Successful authentication',
            success: true,
            accessToken: accessToken,
            user: formatUser(user),
        });
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

const validateRegistration = async (res: Response, data: any, cb: any) => {
    // check if username has not been taken yet
    const oldUser = await UserModel.findOne({
        username: data.username,
    }).exec();

    if (oldUser && oldUser !== null) {
        return res.status(401).json({
            error: {
                message: 'Username already exists.',
                code: 'USERNAME_ALREADY_EXISTS',
            },
            success: false,
        });
    }

    // check if referral code is exists
    const oldReferralCode = await UserModel.findOne({
        uniqueCode: data.referralCode,
    }).exec();

    if (!oldReferralCode) {
        return res.status(401).json({
            error: {
                message: "Referral code doesn't exists.",
                code: 'REFERRAL_CODE_DOESNT_EXISTS',
            },
            success: false,
        });
    }

    // check if unique code has not been taken yet
    const oldUniqueCode = await UserModel.findOne({
        uniqueCode: data.uniqueCode,
    }).exec();

    if (oldUniqueCode && oldUniqueCode !== null) {
        return res.status(401).json({
            error: {
                message: 'Unique code already taken.',
                code: 'UNIQUE_CODE_ALREADY_TAKEN',
            },
            success: false,
        });
    }

    const uniqueCode = await UniqueCodeModel.findOne({
        code: data.uniqueCode,
        status: 'available',
    }).exec();

    if (!uniqueCode) {
        return res.status(401).json({
            error: {
                message: "Unique code doesn't exists.",
                code: 'UNIQUE_CODE_DOESNT_EXISTS',
            },
            success: false,
        });
    }

    return cb();
};

const unilevelPointsGenerator = (level = 1) => {
    if (level === 1) {
        return 200;
    }

    if (level === 2) {
        return 100;
    }

    if (level === 3 || level === 4) {
        return 50;
    }

    if (level >= 5 && level <= 7) {
        return 30;
    }

    if (level >= 8) {
        return 10;
    }

    return 0;
};

const referralPointsIteration = async (
    initialReferralCode: string,
    referredUserId: string
) => {
    let referrerReferralCode = initialReferralCode;
    const todayDate = new Date().toISOString();

    for (let i = 1; i <= 10; i++) {
        const referrerUser = await UserModel.findOne({
            uniqueCode: referrerReferralCode,
        }).exec();

        if (!referrerUser) return;

        referrerReferralCode = referrerUser.referralCode;

        const unilevelPoints =
            Number(referrerUser.unilevelPoints) + unilevelPointsGenerator(i);

        await UserModel.findOneAndUpdate(
            {
                _id: referrerUser._id,
            },
            {
                unilevelPoints: unilevelPoints,
            }
        );

        await ReferralLogModel.create({
            referredUser: referredUserId,
            referrerUser: referrerUser._id,
            referralPoints: unilevelPointsGenerator(i),
            referralType: 'unilevel',
            description: `added referral ${unilevelPointsGenerator(
                i
            )} points from level ${i} and now you have total points of ${unilevelPoints}`,
            createdDate: todayDate,
            updatedDate: todayDate,
        });
    }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        validateRegistration(res, data, async () => {
            const todayDate = new Date().toISOString();

            const referredUser = await UserModel.create({
                username: data.username,
                password: data.password,
                name: data.name,
                uniqueCode: data.uniqueCode,
                referralCode: data.referralCode,
                unilevelPoints: 0,
                repeatPurchasePoints: 0,
                tbcWallet: '',
                btcWallet: '',
                mobileNo: '',
                isActive: true,
                createdDate: todayDate,
                updatedDate: todayDate,
            });

            await UniqueCodeModel.findOneAndUpdate(
                {
                    code: data.uniqueCode,
                },
                {
                    status: 'taken',
                }
            );

            await referralPointsIteration(data.referralCode, referredUser._id);

            return res.json({
                message: 'Successfully created user.',
                success: true,
                user: referredUser,
            });
        });
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

const updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await UserModel.findById(req.body.userId)
            .select('+password')
            .exec();

        if (user && user.password) {
            if (
                !bcryptService.verifyHashString(
                    req.body.currentPassword,
                    user.password
                )
            ) {
                return res.status(401).json({
                    error: {
                        message: 'Current password did not matched.',
                        code: 'INVALID_CURRENT_PASSWORD',
                    },
                    success: false,
                });
            }
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: req.body.userId },
            {
                password: bcryptService.hashString(req.body.newPassword),
            }
        );

        return res.json(updatedUser);
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

const updateDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: req.body.userId },
            {
                name: req.body.name,
                mobileNo: req.body.mobileNo,
            }
        );

        return res.json(updatedUser);
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

const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.json(res.locals.authUser);
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

const registerAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const admin = await AdminModel.create({
            username: 'redlion',
            password: 'redlion101',
            name: 'redlion',
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
        });

        return res.json(admin);
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

const registerFirstUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const todayDate = new Date().toISOString();

        const user = await UserModel.create({
            username: 'redlion',
            password: 'redlion101',
            name: 'redlion',
            uniqueCode: '7fb9b618-c1d3-43b5-b3fa-30eb12edf273',
            referralCode: 'leader',
            unilevelPoints: 0,
            repeatPurchasePoints: 0,
            tbcWallet: '',
            btcWallet: '',
            mobileNo: '',
            isActive: true,
            createdDate: todayDate,
            updatedDate: todayDate,
        });

        return res.json(user);
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

const loginAsAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body;

        const user = await AdminModel.findOne({
            username: data.username,
        }).exec();

        if (!user || user == null) {
            return res.status(401).json({
                error: {
                    message: 'User does not exists.',
                    code: 'USER_NOT_FOUND',
                },
                success: false,
            });
        }

        if (user && user.password) {
            if (!bcryptService.verifyHashString(data.password, user.password)) {
                return res.status(401).json({
                    error: {
                        message: 'Username and password did not matched.',
                        code: 'INVALID_CREDENTIALS',
                    },
                    success: false,
                });
            }
        }

        const jwtPayload = {
            _id: user?._id,
            isAdmin: true,
        };

        const accessToken = jwtService.signPayload(jwtPayload);

        return res.json({
            accessToken: accessToken,
            user: formatUser(user),
        });
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
    login,
    register,
    me,
    registerAdmin,
    loginAsAdmin,
    updatePassword,
    updateDetails,
    registerFirstUser
};
