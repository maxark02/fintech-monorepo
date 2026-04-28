import { User } from "@fin/api-client"

export const login = async (email: string, password: string): Promise<User> => {
  // мок — потом заменишь на реальный запрос
  return {
    username: "Maksim Arkhipov",
    email,
  }
}

export const register = async (username: string, email: string): Promise<User> => {
  return {
    username,
    email,
  }
}
