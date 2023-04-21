import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Marker, MarkerSchema } from './schema/mapPoint.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Polygon, PolygonSchema } from './schema/mapPoligon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Polygon.name, schema: PolygonSchema }]),
    MongooseModule.forFeature([{ name: Marker.name, schema: MarkerSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
