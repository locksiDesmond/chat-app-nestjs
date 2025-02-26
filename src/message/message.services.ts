import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entity/message.entity';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  @OnEvent('message.sent')
  async handleMessageSent(payload: {
    text: string;
    senderId: number;
    room: string;
  }) {
    const { text, senderId, room } = payload;
    await this.saveMessage(text, senderId, room);
  }

  async saveMessage(text: string, senderId: number, room: string) {
    const message = this.messageRepository.create({
      text,
      sender: { id: senderId },
      room,
    });
    return this.messageRepository.save(message);
  }

  async getMessagesByRoom(room: string, limit: number = 50) {
    return this.messageRepository.find({
      where: { room },
      relations: ['sender'],
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async getMessagesByUser(senderId: number) {
    return this.messageRepository.find({
      where: { sender: { id: senderId } },
      relations: ['sender'],
    });
  }
}
