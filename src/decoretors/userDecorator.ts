import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressInterface } from '../user/interface/express.interface';

export const UserDecorator = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExpressInterface>();
    if (!request.user) {
      return null;
    }
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
