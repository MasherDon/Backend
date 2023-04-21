import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateTag } from './dto/tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModule: Model<TagDocument>,
  ) {}

  async create(tag: CreateTag): Promise<Tag> {
    const tags = await this.tagModule.findOne({ name: tag['name'] });
    if (!tags) {
      return await new this.tagModule(tag).save();
    }
    return tags;
  }

  async add(name: string): Promise<Tag> {
    const teg = await this.tagModule.findOne({ name: name });
    return this.tagModule.findOneAndUpdate(
      { name: name },
      { $set: { numb: teg['numb'] + 1 } },
    );
  }

  async del(name: string): Promise<Tag> {
    const teg = await this.tagModule.findOne({ name: name });
    return this.tagModule.findOneAndUpdate(
      { name: name },
      { $set: { numb: teg['numb'] - 1 } },
    );
  }

  async find(): Promise<Tag[]> {
    return this.tagModule.find().sort({ numb: -1 }).skip(0).limit(10);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModule.find().sort({ numb: -1 });
  }

  async getById(name: string): Promise<Tag> {
    return this.tagModule.findOne({ name: name });
  }

  async remove(name: string): Promise<Tag> {
    return this.tagModule.findOneAndRemove({ name: name });
  }

  async update(name: string, tag: CreateTag): Promise<Tag> {
    return this.tagModule.findOneAndUpdate({ name: name }, tag, { new: true });
  }
}
