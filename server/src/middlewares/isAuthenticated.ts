import { MyContext } from "../types"
import { MiddlewareFn } from "type-graphql"

export const isAuthenticated: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('Não autenticado');
  }

  return next();
}  