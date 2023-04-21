import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReserveDocument = Reserve & Document;

@Schema({ versionKey: false })
export class Reserve {
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
  'animals': [];
}

export const ReserveSchema = SchemaFactory.createForClass(Reserve);
