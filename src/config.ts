import dotenv from 'dotenv';

dotenv.config();

export default {
    portNumber: process.env.PORT_NUMBER || 5000,
    dbConnection:
        process.env.DB_CONNECTION || 'mongodb://localhost:27017/ladyred-parfumebiz',
};
