import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ versionKey: false })
export class Comment {
  @Prop({ required: true })
  'article': string;
  @Prop({ required: true })
  'id': number;
  @Prop({ default: Date.now() })
  'createAt': Date;
  @Prop({ required: true })
  'body': string;
  @Prop({ required: true })
  'author': string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
