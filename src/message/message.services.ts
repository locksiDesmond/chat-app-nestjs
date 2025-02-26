import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entity/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

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
