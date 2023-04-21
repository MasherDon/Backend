import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  'username': string;
  @Prop({ required: true })
  'email': string;
  @Prop({ default: 2 })
  'rights': number;
  @Prop({ default: '' })
  'bio': string;
  @Prop({ default: 'https://api.realworld.io/images/smiley-cyrus.jpeg' })
  'image': string;
  @Prop({ required: true })
  'password': string;
  @Prop({ default: [] })
  'fallowing': [string];
}

export const UserSchema = SchemaFactory.createForClass(User);
