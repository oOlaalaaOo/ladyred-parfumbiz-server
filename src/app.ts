import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import loggerService from './services/logger.service';

import routes from './router';

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(compression());

/** API Routes */
const apiVersion = '/api/v1';

app.use(`${apiVersion}`, routes);

/** Rules of our API */
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );

        return res.status(200).json({});
    }

    next();
});

// /** Error handling */
app.use((req: Request, res: Response, next: NextFunction) => {
    let error: any = new Error('Not Found');
    error.status = 404;

    loggerService.error(JSON.stringify(error));

    next(error);
});

// /** Error handling */
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    loggerService.error(JSON.stringify(error));

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });

    next(error);
});

export default app;
