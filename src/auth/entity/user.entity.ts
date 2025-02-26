import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';
import * as argon2 from 'argon2';
import { MessageEntity } from 'src/message/entity/message.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  password: string;

  @Field(() => [MessageEntity])
  @OneToMany(() => MessageEntity, (message) => message.sender)
  messages: MessageEntity[];

  @Field()
  @Column({ type: 'timestamp', nullable: true })
  lastSignInDate: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  toJSON() {
    return instanceToPlain(this);
  }

  async validatePassword(plainTextPassword: string, hashedPassword: string) {
    return await argon2.verify(hashedPassword, plainTextPassword);
  }
}
