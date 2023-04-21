import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from '../article/schemas/article.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Comment, CommentDocument } from '../article/schemas/comment.schema';
import { Tag, TagDocument } from '../tag/schemas/tag.schema';
import { Reserve, ReserveDocument } from '../reserve/schema/reserve.schema';
import { Animal, AnimalDocument } from '../animal/schema/animal.schema';
import { Region, RegionDocument } from '../region/schema/region.schema';
import { Polygon, PolygonDocument } from '../map/schema/mapPoligon.schema';
import { Marker, MarkerDocument } from '../map/schema/mapPoint.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Article.name)
    private readonly ArticleModule: Model<ArticleDocument>,
    @InjectModel(User.name)
    private readonly UserModule: Model<UserDocument>,
    @InjectModel(Comment.name)
    private readonly CommentModule: Model<CommentDocument>,
    @InjectModel(Tag.name)
    private readonly TagModule: Model<TagDocument>,
    @InjectModel(Reserve.name)
    private readonly ReserveModule: Model<ReserveDocument>,
    @InjectModel(Animal.name)
    private readonly AnimalModule: Model<AnimalDocument>,
    @InjectModel(Region.name)
    private readonly RegionModule: Model<RegionDocument>,
    @InjectModel(Polygon.name)
    private readonly PolygonModule: Model<PolygonDocument>,
    @InjectModel(Marker.name)
    private readonly MarkerModule: Model<MarkerDocument>,
  ) {}

  async find(search: string) {
    const set = [];
    set.push({
      user: await this.UserModule.find({
        $or: [
          { username: new RegExp('.*' + search + '.*', 'i') },
          { bio: new RegExp('.*' + search + '.*', 'i') },
        ],
      }),
    });
    set.push({
      tag: await this.TagModule.find({
        name: new RegExp('.*' + search + '.*', 'i'),
      }),
    });
    set.push({
      article: await this.ArticleModule.find({
        $or: [
          { slug: new RegExp('.*' + search + '.*', 'i') },
          { title: new RegExp('.*' + search + '.*', 'i') },
          { description: new RegExp('.*' + search + '.*', 'i') },
          { body: new RegExp('.*' + search + '.*', 'i') },
          { tagList: { $all: [new RegExp('.*' + search + '.*', 'i')] } },
          { author: new RegExp('.*' + search + '.*', 'i') },
        ],
      }),
    });
    set.push({
      comment: await this.CommentModule.find({
        body: new RegExp('.*' + search + '.*', 'i'),
      }),
    });
    set.push({
      reserve: await this.ReserveModule.find({
        $or: [
          { name: new RegExp('.*' + search + '.*', 'i') },
          { Slog: new RegExp('.*' + search + '.*', 'i') },
          { info: new RegExp('.*' + search + '.*', 'i') },
          { put: new RegExp('.*' + search + '.*', 'i') },
        ],
      }),
    });
    set.push({
      animal: await this.AnimalModule.find({
        $or: [
          { name: new RegExp('.*' + search + '.*', 'i') },
          { Slog: new RegExp('.*' + search + '.*', 'i') },
          { info: new RegExp('.*' + search + '.*', 'i') },
          { put: new RegExp('.*' + search + '.*', 'i') },
          { clas: { $all: [new RegExp('.*' + search + '.*', 'i')] } },
          { defend: { $all: [new RegExp('.*' + search + '.*', 'i')] } },
          { labels: { $all: [new RegExp('.*' + search + '.*', 'i')] } },
        ],
      }),
    });
    set.push({
      region: await this.RegionModule.find({
        $or: [
          { name: new RegExp('.*' + search + '.*', 'i') },
          { Slog: new RegExp('.*' + search + '.*', 'i') },
          { info: new RegExp('.*' + search + '.*', 'i') },
          { put: new RegExp('.*' + search + '.*', 'i') },
        ],
      }),
    });
    set.push({
      polygon: await this.PolygonModule.find({
        $or: [
          { name: new RegExp('.*' + search + '.*', 'i') },
          { Slog: new RegExp('.*' + search + '.*', 'i') },
          { info: new RegExp('.*' + search + '.*', 'i') },
        ],
      }),
    });
    set.push({
      marker: await this.MarkerModule.find({
        $or: [
          { name: new RegExp('.*' + search + '.*', 'i') },
          { Slog: new RegExp('.*' + search + '.*', 'i') },
          { info: new RegExp('.*' + search + '.*', 'i') },
        ],
      }),
    });
    return set;
  }
}
