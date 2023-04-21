import { Module } from '@nestjs/common';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Animal, AnimalSchema } from './schema/animal.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
