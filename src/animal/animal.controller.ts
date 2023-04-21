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
import { AnimalService } from './animal.service';
import { AuthGuard } from '../guards/auth.guard';
import { BackPipe } from '../pipes/back.pipe';
import { UserDecorator } from '../decoretors/userDecorator';
import { AnimalInterface } from './interface/animal.interface';
import { AnimalsInterface } from './interface/animals.interface';
import { CreateAnimalDto } from './dto/point.dto';
import { AddAnimalDto } from './dto/add.dto';

@Controller()
export class AnimalController {
  constructor(private readonly AnimalService: AnimalService) {}

  @Get('animals/:nam')
  async getAnimals(@Param('nam') nam: number): Promise<AnimalsInterface> {
    return this.AnimalService.getAnimals(nam);
  }

  @Get('plant/:nam')
  async getPlant(@Param('nam') nam: number): Promise<AnimalsInterface> {
    return this.AnimalService.getPlant(nam);
  }

  @Get('mushrooms/:nam')
  async getMushrooms(@Param('nam') nam: number): Promise<AnimalsInterface> {
    return this.AnimalService.getMushrooms(nam);
  }

  @Get('animal/:Slog')
  async getAnimal(@Param('Slog') Slog: string): Promise<AnimalInterface> {
    return this.AnimalService.getAnimal(Slog);
  }

  @Put('animal/:slug/:reserve')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async add(
    @Param('slug') Slog: string,
    @Param('reserve') reserve: string,
    @UserDecorator('_id') currentId: string,
    @Body('animal') addAnimalDto: AddAnimalDto,
  ) {
    return this.AnimalService.add(Slog, reserve, currentId, addAnimalDto);
  }

  @Delete('animal/:slug/:reserve')
  @UseGuards(AuthGuard)
  async del(
    @Param('slug') Slog: string,
    @Param('reserve') reserve: string,
    @UserDecorator('_id') currentId: string,
  ) {
    return this.AnimalService.del(Slog, reserve, currentId);
  }

  @Put('animal/:Slog')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async upAnimal(
    @Param('Slog') Slog: string,
    @UserDecorator('_id') currentId: string,
    @Body('animal') createAnimalDto: CreateAnimalDto,
  ): Promise<HttpException> {
    return this.AnimalService.upAnimal(currentId, createAnimalDto, Slog);
  }

  @Delete('animal/:Slog')
  @UseGuards(AuthGuard)
  async delAnimal(
    @Param('Slog') Slog: string,
    @UserDecorator('_id') currentId: string,
  ): Promise<HttpException> {
    return this.AnimalService.delAnimal(Slog, currentId);
  }

  @Post('animal')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async createAnimal(
    @UserDecorator('_id') currentId: string,
    @Body('animal') createAnimalDto: CreateAnimalDto,
  ): Promise<HttpException> {
    return this.AnimalService.createAnimal(currentId, createAnimalDto);
  }
}
