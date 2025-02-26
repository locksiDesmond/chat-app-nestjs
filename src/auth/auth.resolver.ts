import { AuthService } from './auth.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login.response';
import { RegisterResponse } from './dto/register.response';
import { RegisterDto } from './dto/register.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginDto) {
    return this.authService.login(input);
  }

  @Mutation(() => RegisterResponse)
  async register(@Args('input') input: RegisterDto) {
    return await this.authService.register(input);
  }
}
