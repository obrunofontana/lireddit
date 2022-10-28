import { Post } from "../entities";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";
import { isAuthenticated } from "../middlewares/isAuthenticated";

@InputType()
class PostInput {
  @Field()
  title: string;
  
  @Field()
  text: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts (
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { dataSource }: MyContext
  ): Promise<Post[]> { 
    const realLimit = Math.min(20, limit);

     const builder = dataSource
      .getRepository(Post)
      .createQueryBuilder('p')
      .limit(realLimit)
      .orderBy('"createdAt"', 'DESC')
    
    if (cursor) { 
      builder.where('"createdAt" < :cursor', { cursor: new Date(cursor) });
    }

    return builder.getMany();
  }

  @Query(() => Post, { nullable: true})
  post (@Arg('id', () => Int) id: number): Promise<Post | null> {
    return Post.findOne({ where: { id } });
  }
 
  @Mutation(() => Post)
  @UseMiddleware(isAuthenticated)
  async createPost (
    @Arg('input') input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost (
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true } ) title: string,
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });

    if (!post) {
      return null;
    }

    if (typeof title !== 'undefined') {
      await Post.update({ id }, { title });
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost (
    @Arg('id') id: number,
  ): Promise<Boolean> {
    await Post.delete(id);
    return true;
  }
}