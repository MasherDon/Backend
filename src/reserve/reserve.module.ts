import { Module } from '@nestjs/common';
import { ReserveController } from './reserve.controller';
import { ReserveService } from './reserve.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Reserve, ReserveSchema } from './schema/reserve.schema';
import { Animal, AnimalSchema } from '../animal/schema/animal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reserve.name, schema: ReserveSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalSchema }]),
  ],
  controllers: [ReserveController],
  providers: [ReserveService],
})
export class ReserveModule {}
