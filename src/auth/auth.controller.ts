import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDTO } from './auth.dto';

@Controller('auth')
export class AuthController {


    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body('email') email: string,
        @Body('password') password: string,
    ) : Promise<AuthResponseDTO>{
        return  this.authService.signIn(email, password);
    }
}
