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
import { ReserveService } from './reserve.service';
import { AuthGuard } from '../guards/auth.guard';
import { BackPipe } from '../pipes/back.pipe';
import { UserDecorator } from '../decoretors/userDecorator';
import { CreateReserveDto } from './dto/createRegion.gto';
import { reserveInterface } from './interface/reserve.interface';
import { reservesInterface } from './interface/reserves.interface';

@Controller()
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Get('reserves/:nam')
  async getRegions(@Param('nam') nam: number): Promise<reservesInterface> {
    return this.reserveService.getReserves(nam);
  }

  @Get('reserve/:Slog')
  async getRegion(@Param('Slog') Slog: string): Promise<reserveInterface> {
    return this.reserveService.getReserve(Slog);
  }

  @Put('reserve/:Slog')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async upReserve(
    @Param('Slog') Slog: string,
    @UserDecorator('_id') currentId: string,
    @Body('reserve') createReserveDto: CreateReserveDto,
  ): Promise<HttpException> {
    return this.reserveService.upReserves(currentId, createReserveDto, Slog);
  }

  @Delete('reserve/:Slog')
  @UseGuards(AuthGuard)
  async delReserve(
    @Param('Slog') Slog: string,
    @UserDecorator('_id') currentId: string,
  ): Promise<HttpException> {
    return this.reserveService.delReserve(Slog, currentId);
  }

  @Post('reserve')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async create(
    @UserDecorator('_id') currentId: string,
    @Body('reserve') createReserveDto: CreateReserveDto,
  ): Promise<HttpException> {
    return this.reserveService.createReserve(currentId, createReserveDto);
  }
}
