import bcrypt from "bcrypt";

const saltRounds: number = 10;

const hashString = (str: string) => { 
  return bcrypt.hash(str, saltRounds);
};

const verifyHashString = (plainString: string, hashedString: string) => {
  return bcrypt.compare(plainString, hashedString);
};

export default {
  hashString,
  verifyHashString,
};
