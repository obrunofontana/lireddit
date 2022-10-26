export const validateIsValidEmail = (email: string): boolean => {
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return email.match(emailFormat) ? true : false;
}