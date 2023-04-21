import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimalDocument = Animal & Document;

@Schema({ versionKey: false })
export class Animal {
  @Prop({ required: true })
  'name': string;
  @Prop({ required: true })
  'Slog': string;
  @Prop({ required: true })
  'image': string;
  @Prop({ required: true })
  'put': string;
  @Prop({ require: true })
  'info': string;
  @Prop({ default: ['Животные'] })
  'clas': string[];
  @Prop()
  'defend': string[];
  @Prop()
  'label': string;
  @Prop()
  'reserve': string[];
  @Prop()
  'labels': [string[]];
  @Prop()
  'data': [number[]];
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
