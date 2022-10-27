import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";
import { validateIsValidEmail } from "./validateIsValidEmail";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length < 4) {
    return [{
      field: 'username',
      message: 'Username é menor que 4 caracteres.'
    }]
  }

  if (options.password.length < 4) {
    return [{
      field: 'password',
      message: 'A senha é menor que 4 caracteres.'
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