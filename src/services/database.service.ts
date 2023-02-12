import mongoose from 'mongoose';
import config from '../config';

const connect = () => {
    const db_connection =
        process.env.ENVIRONMENT === 'dev'
            ? 'mongodb://localhost:27017/ladyred-parfumebiz'
            : config.dbConnection;

    mongoose.connect(db_connection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export default {
    connect,
};
