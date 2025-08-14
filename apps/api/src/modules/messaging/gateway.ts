import { OnGatewayConnection, OnGatewayInit, WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/ws', cors: { origin: true, credentials: true } })
export class MessagingGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  afterInit() {}

  handleConnection() {}

  @SubscribeMessage('typing:start')
  handleTypingStart(@MessageBody() _payload: any) {}
}


