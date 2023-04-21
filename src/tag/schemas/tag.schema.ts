import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({ versionKey: false })
export class Tag {
  @Prop({ required: true })
  'name': string;
  @Prop({ default: 0 })
  'numb': number;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
