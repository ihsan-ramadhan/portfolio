import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPasswordHash = this.configService.get<string>(
      'ADMIN_PASSWORD_HASH',
    );

    if (!adminEmail || !adminPasswordHash) {
      throw new UnauthorizedException(
        'Konfigurasi admin belum lengkap di server',
      );
    }

    if (email !== adminEmail) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const payload = { email: adminEmail, sub: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
