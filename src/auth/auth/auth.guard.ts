import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthGuard implements CanActivate {

private jwtSecret : string;

constructor(private readonly jwtService: JwtService, private readonly configService : ConfigService){
  this.jwtSecret = this.configService.getOrThrow<string>("JWT_SECRET") ;
}

  async canActivate(
    context:  ExecutionContext,
  ): Promise<boolean>  {
    const  request  = context.switchToHttp().getRequest();
    const  token  = this.extractTokenFromHeader(request);
    
    if(!token){
      throw new UnauthorizedException();
    }
    try{
      const payload =  this.jwtService.verifyAsync(token, 
        {
          secret : this.jwtSecret
        }
      );
      request['user'] = payload;
    }catch(error){
      throw new UnauthorizedException();
    }

    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  
}
