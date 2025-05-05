import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthResponseDTO } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  private readonly jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly UserServices: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.getOrThrow<number>(
      'JWT_EXPIRATION_TIME',
    );
  }

  async signIn(email: string, password: string): Promise<AuthResponseDTO> {
    const user = await this.UserServices.findOneByEmail(email);

    if (
      !user ||
      !user.password ||
      !bcrypt.compareSync(password, user.password)
    ) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

   const token = this.jwtService.sign(payload)
    return {
      token, 
      expiresIn: this.jwtExpirationTimeInSeconds * 1000,
    };
  }
}
