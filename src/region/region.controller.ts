import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { regionInterface } from './interface/refion.interface';
import { regionsInterface } from './interface/refions.interface';
import { AuthGuard } from '../guards/auth.guard';
import { BackPipe } from '../pipes/back.pipe';
import { UserDecorator } from '../decoretors/userDecorator';
import { CreateRegionDto } from './dto/createRegion.gto';

@Controller()
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('regions/:nam')
  async getRegions(@Param('nam') nam: number): Promise<regionsInterface> {
    return this.regionService.getRegions(nam);
  }

  @Get('region/:Slog')
  async getRegion(@Param('Slog') Slog: string): Promise<regionInterface> {
    return this.regionService.getRegion(Slog);
  }

  @Put('region/:Slog')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async upReserve(
    @Param('Slog') Slog: string,
    @UserDecorator('_id') currentId: string,
    @Body('region') createRegionDto: CreateRegionDto,
  ): Promise<HttpException> {
    return this.regionService.upRegion(currentId, createRegionDto, Slog);
  }

  @Delete('region/:Slog')
  @UseGuards(AuthGuard)
  async delReserve(
    @Param('Slog') Slog: string,
    @UserDecorator('_id') currentId: string,
  ): Promise<HttpException> {
    return this.regionService.delRegion(Slog, currentId);
  }

  @Post('region')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async create(
    @UserDecorator('_id') currentId: string,
    @Body('region') createRegionDto: CreateRegionDto,
  ): Promise<HttpException> {
    return this.regionService.createRegion(currentId, createRegionDto);
  }
}
