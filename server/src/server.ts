import 'reflect-metadata';

import { MikroORM } from '@mikro-orm/core';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { buildSchema } from 'type-graphql';

import { COOKIE_NAME, __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';

const PORT = 4000;

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ 
        client: redis,
        disableTouch: true, 
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 265 * 10, // 10 anos
        httpOnly: true,
        secure: __prod__, // cookie só funciona in https
        sameSite: 'lax', // csrf 
      },
      saveUninitialized: false,
      secret: "qwerty",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req, res }): MyContext => ({ em: orm.em, req , res, redis })
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
});