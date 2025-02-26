import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatResolver } from './chat.resolver';
import { ActiveUsersService } from './chat.services';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME') || '12h',
          },
        };
      },
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [ChatGateway, ActiveUsersService, ChatResolver],
})
export class ChatModule {}
