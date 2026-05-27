import { User } from "@fin/api-client";

export const login = async (email: string, password: string): Promise<User> => {
  return {
    username: email.split("@")[0],
    email,
  };
};

export const register = async (
  username: string,
  email: string,
): Promise<User> => {
  return {
    username,
    email,
  };
};
