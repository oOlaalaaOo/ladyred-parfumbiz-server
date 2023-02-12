import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync("./keys/private.key", "utf8");
const publicKey = fs.readFileSync("./keys/public.key", "utf8");

const signPayload = (payload: any) => {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "1h",
    issuer: "lady-parfumbiz",
  });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, publicKey);
  } catch (err) {
    console.log(err);

    return err;
  }
};

const decodeToken = (token: string) => {
  return jwt.decode(token, { complete: true });
};

export default {
  signPayload,
  verifyToken,
  decodeToken,
};
