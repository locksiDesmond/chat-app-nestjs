import { Resolver, Query, Args } from '@nestjs/graphql';
import { MessageEntity } from './entity/message.entity';
import { MessageService } from './message.services';

@Resolver(() => MessageEntity)
export class MessageResolver {
  constructor(private messageService: MessageService) {}

  @Query(() => [MessageEntity], { name: 'messages' })
  async getMessages(@Args('room') room: string) {
    return this.messageService.getMessagesByRoom(room);
  }
}
