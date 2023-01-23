import bcrypt from "bcrypt";

const saltRounds: number = 12;

const hashString = (str: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedStr = bcrypt.hashSync(str, salt);

  return hashedStr;
};

const verifyHashString = (plainString: string, hashedString: string) => {
  return bcrypt.compareSync(plainString, hashedString);
};

export default {
  hashString,
  verifyHashString,
};
