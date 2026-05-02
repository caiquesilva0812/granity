import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      // Mensagem genérica — não revela se o e-mail existe ou não
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Conta desativada.');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email },
    };
  }
}
