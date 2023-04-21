import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JwtSecret } from '../user/config';
import { UserService } from '../user/user.service';
import { ExpressInterface } from '../user/interface/express.interface';

@Injectable()
export class authMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, JwtSecret);
      req.user = await this.userService.findName(decode['username']);
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
