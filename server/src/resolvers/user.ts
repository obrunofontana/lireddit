import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { COOKIE_NAME } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateIsValidEmail } from "../utils/validateIsValidEmail";
import { validateRegister } from "../utils/validateRegister";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string, 
    // @Ctx() { em }: MyContext
  ) {
    // const user = await em.findOne(User, { email });
    return true;
  }
  
  
  @Query(() => User, { nullable: true })
  async me (
    @Ctx() { req, em  }: MyContext
  ) {
    // usuário não está logado;
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register (
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {   
    const errors = validateRegister(options);    

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
      email: options.email
    });

    try {
      await em.persistAndFlush(user);
    } catch (e) {
      if (e.code === '23505' || e.detail.includes('already exists')) {
        return {
          errors: [{
            field: 'username',
            message: 'Username already taken',
          }]
        }
      }
    }

    // mantém o usuário no cookie para informar e mantê-lo logado
    req.session.userId = user.id;

    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async login (
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const where = validateIsValidEmail(usernameOrEmail) ? { email: usernameOrEmail } : { username: usernameOrEmail};
    const user = await em.findOne(User, where);

    if (!user) {
      return {
        errors: [{
          field: 'usernameOrEmail',
          message: 'Usuário não encontrado.'
        }]
      }
    }

    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      return {
        errors: [{
          field: 'password',
          message: 'Senha incorreta.'
        }]
      }
    }

    // mantém o usuário no cookie para informar e mantê-lo logado
    req.session.userId = user.id;

    return {
      user
    };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    // limpa a sessão
    return new Promise(resolve => req.session.destroy(e => {
      res.clearCookie(COOKIE_NAME); // limpa o cookie
      if (e) {
        resolve(false);
        return;
      }
      resolve(true);
    }));
  }
}