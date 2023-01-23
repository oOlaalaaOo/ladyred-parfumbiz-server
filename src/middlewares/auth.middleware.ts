import { NextFunction, Request, Response } from 'express';
import { formatUser } from '../utils/data-transformer.util';
import AdminModel from '../models/admin.model';
import UserModel from '../models/user.model';
import jwtService from '../services/jwt.service';

const isAuthorized = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return next(notAuthorizedHandler());
    }

    const token = authHeader.substr(7);

    if (!token) {
        return next(notAuthorizedHandler());
    }

    const decodedToken = jwtService.verifyToken(token);

    if (!decodedToken) {
        return next(notAuthorizedHandler());
    }

    const user = await UserModel.findOne({ _id: decodedToken._id }).exec();

    if (!user) {
        return next(notAuthorizedHandler());
    }

    res.locals.authUser = formatUser(user);

    next();
};

const isAuthorizedAsAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return next(notAuthorizedHandler());
    }

    const token = authHeader.substr(7);

    if (!token) {
        return next(notAuthorizedHandler());
    }

    const decodedToken = jwtService.verifyToken(token);

    if (!decodedToken) {
        return next(notAuthorizedHandler());
    }

    const user = await AdminModel.findOne({ _id: decodedToken._id }).exec();

    if (!user) {
        return next(notAuthorizedHandler());
    }

    res.locals.authUser = formatUser(user);

    next();
};

const notAuthorizedHandler = () => {
    let err: any = new Error('not-authorized');
    err.status = 403;

    return err;
};

export default {
    isAuthorized,
    isAuthorizedAsAdmin,
};
