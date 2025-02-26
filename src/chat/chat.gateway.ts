import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ActiveUsersService } from './chat.services';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    private activeUsersService: ActiveUsersService,
  ) {}

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async guardConnection(client: Socket) {
    const token = this.extractTokenFromHeader(client);
    if (!token) {
      client.disconnect();
      return null;
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!payload) {
      client.disconnect();
      return null;
    }
    return payload;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { username: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.activeUsersService.addUserToRoom(data.room, data.username);
    this.server
      .to(data.room)
      .emit('message', `${data.username} joined the room`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { sender: string; text: string; timestamp: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.guardConnection(client);

    if (!user) return;

    const room = Array.from(client.rooms)[1];

    if (!room) {
      return console.error('room not found');
    }

    this.server.to(room).emit('message', data);

    this.eventEmitter.emit('message.sent', {
      text: data.text,
      senderId: user.sub,
      room: room,
    });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { username: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    this.activeUsersService.removeUserFromRoom(data.room, data.username);
    this.server.to(data.room).emit('message', `${data.username} left the room`);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.guardConnection(client);

    if (!user) return;

    const rooms = Array.from(client.rooms);

    rooms.forEach((room) => {
      this.activeUsersService.removeUserFromRoom(room, user.username);
    });
  }
}
