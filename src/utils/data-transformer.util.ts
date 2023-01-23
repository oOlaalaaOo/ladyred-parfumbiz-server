export const formatUser = (user: any) => {
  user["username"] = undefined;
  user["password"] = undefined;

  return user;
};
