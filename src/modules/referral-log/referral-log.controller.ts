import { Request, Response, NextFunction } from 'express';
import referralLogModel from '../../models/referral-log.model';

const getLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const referralLogs = await referralLogModel
            .find({ referrerUser: req.params.userId })
            .populate('referredUser referrerUser')
            .exec();

        res.json(referralLogs);
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
    getLogs,
};
