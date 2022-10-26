import { User } from "..//entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

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
    if (options.username.length < 4) {
      return {
        errors: [{
          field: 'username',
          message: 'Username must be at least 4 characters'
        }]
      }
    }

    if (options.password.length < 4) {
      return {
        errors: [{
          field: 'password',
          message: 'Password must be at least 4 characters'
        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
      password: hashedPassword
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
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: 'Usuário não encontrado.'
        }]
      }
    }

    const isValidPassword = await argon2.verify(user.password, options.password);

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
}