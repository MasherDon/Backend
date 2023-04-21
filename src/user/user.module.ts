import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthGuard } from '../guards/auth.guard';
import { Recover, RecoverSchema } from './schemas/recover.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Recover.name, schema: RecoverSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
