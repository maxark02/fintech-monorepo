import type { User } from "@fin/api-client";
import { redirect } from "next/navigation";

const users = [
  {
    username: "test",
    email: "test@gmail.com",
  },
];

const generateToken = (user: User) => {
  return btoa(JSON.stringify(user));
};

export const register = async (name: string, email: string): Promise<User> => {
  return {
    username: name,
    email: email,
  };
};

export const login = async (email: string, password: string): Promise<User> => {
  if (!email || !password) {
    alert("Wrong email or password");
  }
  return redirect("/dashboard/balance");
};
