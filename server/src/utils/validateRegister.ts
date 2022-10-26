import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";
import { validateIsValidEmail } from "./validateIsValidEmail";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length < 4) {
    return [{
      field: 'username',
      message: 'Username must be at least 4 characters'
    }]
  }

  if (options.password.length < 4) {
    return [{
      field: 'password',
      message: 'Password must be at least 4 characters'
    }]
  }

  const isValidEmail = validateIsValidEmail(options.email);  
  if (!isValidEmail) {
    return [{
      field: 'email',
      message: 'E-mail é inválido'
    }]
  }

  return null;
}