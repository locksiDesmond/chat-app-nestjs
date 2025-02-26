import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/auth/entity/user.entity';
import { MessageEntity } from './entity/message.entity';
import { MessageService } from './message.services';
import { MessageResolver } from './message.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MessageEntity])],
  controllers: [],
  providers: [MessageService, MessageResolver],
})
export class MessageModule {}
