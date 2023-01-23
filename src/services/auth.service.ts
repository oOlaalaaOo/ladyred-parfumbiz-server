import { Request, Response } from "express";
import jwtService from "./jwt.service";

const authUser = (req: Request, res: Response) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  const decodedToken = jwtService.verifyToken(token);

  if (!decodedToken) {
    return res.sendStatus(403);
  }

  return decodedToken;
};

export default {
  authUser,
};
