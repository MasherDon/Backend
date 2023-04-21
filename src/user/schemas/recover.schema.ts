import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecoverDocument = Recover & Document;

@Schema({ versionKey: false })
export class Recover {
  @Prop({ required: true })
  'date': Date;
  @Prop({ required: true })
  'email': string;
  @Prop({ required: true })
  'code': string;
}

export const RecoverSchema = SchemaFactory.createForClass(Recover);
