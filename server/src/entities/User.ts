import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'date' })
  createdAt?: Date = new Date();

  @Field()
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Field() // field é pro graphql entender
  @Property({ type: 'text', unique: true }) // property é do MikroOrm
  username!: string;

  @Property({ type: 'text' }) // property é do MikroOrm
  password!: string;
}