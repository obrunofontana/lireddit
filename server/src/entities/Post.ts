import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @CreateDateColumn() // ORM 
  createdAt?: Date;

  @Field()
  @UpdateDateColumn() // ORM
  updatedAt?: Date;

  @Field() // field é pro graphql entender, se quiser ocultar um campo só não decorar com este decorator
  @Column({ type: 'text' }) // ORM
  title!: string;
}