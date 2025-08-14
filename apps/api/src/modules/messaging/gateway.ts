import { OnGatewayConnection, OnGatewayInit, WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service.js';

@WebSocketGateway({ namespace: '/ws', cors: { origin: true, credentials: true } })
export class MessagingGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server!: Server;
  constructor(private readonly prisma: PrismaService) {}

  afterInit() {}

  handleConnection() {}

  private room(conversationId: string) {
    return `conversation:${conversationId}`;
  }

  @SubscribeMessage('conversation:join')
  async handleJoin(@MessageBody() payload: { conversationId: string }, @ConnectedSocket() socket: Socket) {
    socket.join(this.room(payload.conversationId));
    this.server.to(this.room(payload.conversationId)).emit('conversation:joined', { conversationId: payload.conversationId });
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(@MessageBody() payload: { conversationId: string; userId: string }) {
    this.server.to(this.room(payload.conversationId)).emit('typing', { conversationId: payload.conversationId, userId: payload.userId, state: 'start' });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(@MessageBody() payload: { conversationId: string; userId: string }) {
    this.server.to(this.room(payload.conversationId)).emit('typing', { conversationId: payload.conversationId, userId: payload.userId, state: 'stop' });
  }

  @SubscribeMessage('message:send')
  async handleSend(@MessageBody() payload: { conversationId: string; senderId: string; text: string }) {
    const message = await this.prisma.message.create({ data: { conversationId: payload.conversationId, senderId: payload.senderId, text: payload.text } });
    this.server.to(this.room(payload.conversationId)).emit('message:new', { message });
  }

  @SubscribeMessage('message:read')
  async handleRead(@MessageBody() payload: { conversationId: string; userId: string; messageId: string }) {
    await this.prisma.messageReceipt.upsert({
      where: { messageId_userId: { messageId: payload.messageId, userId: payload.userId } },
      create: { messageId: payload.messageId, userId: payload.userId, readAt: new Date() },
      update: { readAt: new Date() },
    });
    this.server.to(this.room(payload.conversationId)).emit('message:read', { conversationId: payload.conversationId, userId: payload.userId, messageId: payload.messageId });
  }
}


