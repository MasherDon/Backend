import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './schemas/tag.schema';
import { CreateTag } from './dto/tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get(':name')
  async getById(@Param('name') name: string): Promise<Tag> {
    return await this.tagService.getById(name);
  }

  @Post()
  async create(@Body() createTag: CreateTag): Promise<Tag> {
    return await this.tagService.create(createTag);
  }

  @Post('add/:name')
  async add(@Param('name') name: string): Promise<Tag> {
    return await this.tagService.add(name);
  }

  @Delete('del/:name')
  async del(@Param('name') name: string): Promise<Tag> {
    return await this.tagService.del(name);
  }

  @Get('top')
  async find(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.find();
    return {
      tags: tags.map((x) => x['name']),
    };
  }

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((x) => x['name']),
    };
  }

  @Delete(':name')
  async remove(@Param('name') name: string): Promise<Tag> {
    return await this.tagService.remove(name);
  }

  @Put(':name')
  async update(
    @Body() createTag: CreateTag,
    @Param('name') name: string,
  ): Promise<Tag> {
    return await this.tagService.update(name, createTag);
  }
}
