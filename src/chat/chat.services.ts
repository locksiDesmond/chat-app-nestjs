import { Injectable } from '@nestjs/common';

@Injectable()
export class ActiveUsersService {
  private activeUsers: Map<string, Set<string>> = new Map();

  addUserToRoom(room: string, username: string) {
    if (!this.activeUsers.has(room)) {
      this.activeUsers.set(room, new Set());
    }
    this.activeUsers.get(room).add(username);
  }

  removeUserFromRoom(room: string, username: string) {
    if (this.activeUsers.has(room)) {
      this.activeUsers.get(room).delete(username);
      if (this.activeUsers.get(room).size === 0) {
        this.activeUsers.delete(room);
      }
    }
  }

  getUsersInRoom(room: string): string[] {
    return Array.from(this.activeUsers.get(room) || []);
  }
}
