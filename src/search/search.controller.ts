import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':search')
  async findAll(@Param('search') search: string) {
    return await this.searchService.find(search);
  }
}
