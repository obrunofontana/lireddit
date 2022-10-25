import 'reflect-metadata';

import { MikroORM } from '@mikro-orm/core';
import express from 'express'; 
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import session from 'express-session'
import { createClient } from 'redis';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

const PORT = 4000;


const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ 
        client: redisClient,
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
    context: ({ req, res }): MyContext => ({ em: orm.em, req , res })
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
});