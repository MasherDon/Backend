import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ versionKey: false })
export class Article {
  @Prop({ required: true })
  'slug': string;
  @Prop({ required: true })
  'title': string;
  @Prop({ default: '' })
  'description': string;
  @Prop({ default: '' })
  'body': string;
  @Prop({ default: Date.now() })
  'createAt': Date;
  @Prop({ default: Date.now() })
  'updateAt': Date;
  @Prop({ default: [] })
  'tagList': [string];
  @Prop({ default: 0 })
  'favoritesCount': number;
  @Prop({ default: [] })
  'favorited': [string];
  @Prop({ required: true })
  'author': string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
