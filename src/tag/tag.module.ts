import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { Tag, TagSchema } from './schemas/tag.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
