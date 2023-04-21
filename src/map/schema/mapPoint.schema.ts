import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MarkerDocument = Marker & Document;

@Schema({ versionKey: false })
export class Marker {
  @Prop({ required: true })
  'lat': number;
  @Prop({ required: true })
  'lng': number;
  @Prop({ required: true })
  'name': string;
  @Prop({ required: true })
  'info': string;
  @Prop({ required: true })
  'image': string;
  @Prop({ default: '' })
  'icon': string;
  @Prop({ default: '' })
  'Slog': string;
}

export const MarkerSchema = SchemaFactory.createForClass(Marker);
