import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Region, RegionSchema } from './schema/region.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Polygon, PolygonSchema } from '../map/schema/mapPoligon.schema';
import { Animal, AnimalSchema } from '../animal/schema/animal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Region.name, schema: RegionSchema }]),
    MongooseModule.forFeature([{ name: Polygon.name, schema: PolygonSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalSchema }]),
  ],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
