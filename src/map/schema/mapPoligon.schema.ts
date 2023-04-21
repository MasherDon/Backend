import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PolygonDocument = Polygon & Document;

@Schema({ versionKey: false })
export class Polygon {
  @Prop({ required: true })
  'paths': [[number]];
  @Prop({ required: true })
  'name': string;
  @Prop({ required: true })
  'image': string;
  @Prop({ required: true })
  'info': string;
  @Prop({ default: '#000000' })
  'fillColor': string;
  @Prop({ default: '#ffffff' })
  'strokeColor': string;
  @Prop({ default: '' })
  'icon': string;
  @Prop({ default: '' })
  'Slog': string;
}

export const PolygonSchema = SchemaFactory.createForClass(Polygon);
