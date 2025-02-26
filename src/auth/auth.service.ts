import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['password'],
    });

    if (user && user.validatePassword(user.password, pass)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(input: LoginDto) {
    const user = await this.validateUser(input.username, input.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto) {
    const payload = { username: dto.username, password: dto.password };

    if (
      await this.userRepository.findOne({ where: { username: dto.username } })
    ) {
      throw new BadRequestException('User already exists');
    }

    const user = this.userRepository.create(payload);

    await this.userRepository.save(user);

    return { message: 'Account created please proceed to login' };
  }
}
