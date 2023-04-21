import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Article, ArticleSchema } from '../article/schemas/article.schema';
import { Comment, CommentSchema } from '../article/schemas/comment.schema';
import { Tag, TagSchema } from '../tag/schemas/tag.schema';
import { Reserve, ReserveSchema } from '../reserve/schema/reserve.schema';
import { Animal, AnimalSchema } from '../animal/schema/animal.schema';
import { Region, RegionSchema } from '../region/schema/region.schema';
import { Polygon, PolygonSchema } from '../map/schema/mapPoligon.schema';
import { Marker, MarkerSchema } from '../map/schema/mapPoint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    MongooseModule.forFeature([{ name: Reserve.name, schema: ReserveSchema }]),
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalSchema }]),
    MongooseModule.forFeature([{ name: Region.name, schema: RegionSchema }]),
    MongooseModule.forFeature([{ name: Polygon.name, schema: PolygonSchema }]),
    MongooseModule.forFeature([{ name: Marker.name, schema: MarkerSchema }]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
