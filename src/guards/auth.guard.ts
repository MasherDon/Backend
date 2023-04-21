import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ExpressInterface } from '../user/interface/express.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExpressInterface>();
    if (request.user) {
      return true;
    }
    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
