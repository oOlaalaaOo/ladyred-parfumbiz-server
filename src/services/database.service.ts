import mongoose from "mongoose";
import config from "../config";

const connect = () => {
  const db_connection = config.dbConnection;

  mongoose.connect(db_connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default {
  connect,
};
