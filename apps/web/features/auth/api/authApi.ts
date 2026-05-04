import { User } from "@fin/api-client";
import jwt from "jsonwebtoken";

const SECRET = "mock-secret-key";

export const login = async (
  email: string,
  password: string,
): Promise<{ user: User; token: string }> => {
  // мок — имитируем проверку пароля
  if (password.length < 6) throw new Error("Invalid credentials");

  const user: User = { username: email.split("@")[0], email };
  const token = jwt.sign({ email, username: user.username }, SECRET, {
    expiresIn: "7d",
  });

  return { user, token };
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<{ user: User; token: string }> => {
  if (password.length < 6) throw new Error("Password too short");

  const user: User = { username, email };
  const token = jwt.sign({ email, username }, SECRET, { expiresIn: "7d" });

  return { user, token };
};

export const verifyToken = (token: string): User | null => {
  try {
    return jwt.verify(token, SECRET) as User;
  } catch {
    return null;
  }
};
