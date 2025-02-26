import { Resolver, Query, Args } from '@nestjs/graphql';
import { ActiveUsersService } from './chat.services';

@Resolver()
export class ChatResolver {
  constructor(private activeUsersService: ActiveUsersService) {}

  @Query(() => [String], { name: 'activeUsers' })
  getActiveUsers(@Args('room') room: string): string[] {
    return this.activeUsersService.getUsersInRoom(room);
  }
}
