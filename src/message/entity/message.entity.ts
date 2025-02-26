import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from 'src/auth/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@ObjectType()
@Entity()
export class MessageEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.messages)
  sender: UserEntity;

  @Column()
  senderId: number;

  @Field()
  @Column()
  room: string;
}
