import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  private server: Server;

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { username: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.server
      .to(data.room)
      .emit('message', `${data.username} joined the room`);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: { sender: string; text: string; timestamp: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = Array.from(client.rooms)[1];
    this.server.to(room).emit('message', data);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { username: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    this.server.to(data.room).emit('message', `${data.username} left the room`);
  }
}
