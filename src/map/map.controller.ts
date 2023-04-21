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
import { MapService } from './map.service';
import { PointsInterface } from './interface/points.interface';
import { BackPipe } from '../pipes/back.pipe';
import { AuthGuard } from '../guards/auth.guard';
import { UserDecorator } from '../decoretors/userDecorator';
import { CreateMarkerDto } from './dto/point.dto';
import { CreatePolygonDto } from './dto/polygon.dto';
import { PolygonInterface } from './interface/polygons.interface';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Put('marker/:Slog')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async upMarker(
    @UserDecorator('_id') currentId: string,
    @Body('marker') createMarkerDto: CreateMarkerDto,
    @Param('Slog') Slog: string,
  ): Promise<HttpException> {
    return this.mapService.upMarker(currentId, createMarkerDto, Slog);
  }

  @Delete('marker/:Slog')
  @UseGuards(AuthGuard)
  async delMarker(
    @UserDecorator('_id') currentId: string,
    @Param('Slog') Slog: string,
  ): Promise<HttpException> {
    return this.mapService.delMarker(currentId, Slog);
  }

  @Post('marker')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async createMarker(
    @UserDecorator('_id') currentId: string,
    @Body('marker') createMarkerDto: CreateMarkerDto,
  ): Promise<HttpException> {
    return this.mapService.createMarker(currentId, createMarkerDto);
  }

  @Get('markers')
  async getMarkers(): Promise<PointsInterface> {
    return this.mapService.getMarkers();
  }

  @Put('polygon/:Slog')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async upPolygon(
    @UserDecorator('_id') currentId: string,
    @Body('polygon') createPolygonDto: CreatePolygonDto,
    @Param('Slog') Slog: string,
  ): Promise<HttpException> {
    return this.mapService.upPolygon(currentId, createPolygonDto, Slog);
  }

  @Delete('polygon/:Slog')
  @UseGuards(AuthGuard)
  async delPolygon(
    @UserDecorator('_id') currentId: string,
    @Param('Slog') Slog: string,
  ): Promise<HttpException> {
    return this.mapService.delPolygon(currentId, Slog);
  }

  @Post('polygon')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async createPolygon(
    @UserDecorator('_id') currentId: string,
    @Body('polygon') createPolygonDto: CreatePolygonDto,
  ): Promise<HttpException> {
    return this.mapService.createPolygon(currentId, createPolygonDto);
  }

  @Get('polygons')
  async getPolygons(): Promise<PolygonInterface> {
    return this.mapService.getPolygon();
  }
}
