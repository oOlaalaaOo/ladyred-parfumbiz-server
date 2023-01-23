import { Request, Response, NextFunction } from 'express';
import UniqodeModel from '../../models/unique-code.model';
import { v4 as uuidv4 } from 'uuid';

interface IUniqode {
    code: string;
    status: string;
    createdDate: string;
    updatedDate: string;
}

const prefillUniqueCodes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const uniqodes: IUniqode[] = [];

        for (let i = 0; i <= 1000; i++) {
            uniqodes.push({
                code: uuidv4(),
                status: 'available',
                createdDate: new Date().toISOString(),
                updatedDate: new Date().toISOString(),
            });
        }

        await UniqodeModel.insertMany(uniqodes);

        res.json({
            message: 'Successfully get users.',
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

const uniqueCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const perPage = Number(req.query.limit) || 10;

        const page = (): number => {
            const page = Number(req.query.page) || 0;

            return page * perPage;
        };

        const allUniqodes = await UniqodeModel.find({
            status: 'available',
        }).exec();

        const uniqodes = await UniqodeModel.find({
            status: 'available',
        })
            .limit(perPage)
            .skip(page())
            .exec();

        res.json({
            total: allUniqodes.length,
            page: page(),
            uniqodes,
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
    prefillUniqueCodes,
    uniqueCodes,
};
