import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RegionDocument = Region & Document;

@Schema({ versionKey: false })
export class Region {
  @Prop({ required: true })
  'name': string;
  @Prop({ required: true })
  'Slog': string;
  @Prop({ required: true })
  'lat': number;
  @Prop({ required: true })
  'lng': number;
  @Prop({ required: true })
  'info': string;
  @Prop({ required: true })
  'put': string;
  @Prop({ required: true })
  'intro': string;
  @Prop({ required: true })
  'map': string;
  @Prop()
  'reserves': [];
  @Prop()
  'animals': [];
}

export const RegionSchema = SchemaFactory.createForClass(Region);
