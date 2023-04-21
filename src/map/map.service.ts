import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Marker, MarkerDocument } from './schema/mapPoint.schema';
import { PointsInterface } from './interface/points.interface';
import { CreateMarkerDto } from './dto/point.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Polygon, PolygonDocument } from './schema/mapPoligon.schema';
import { CreatePolygonDto } from './dto/polygon.dto';
import { PolygonInterface } from './interface/polygons.interface';
import slugify from 'slugify';

@Injectable()
export class MapService {
  constructor(
    @InjectModel(Marker.name)
    private readonly MarkerModule: Model<MarkerDocument>,
    @InjectModel(User.name) private readonly UserModule: Model<UserDocument>,
    @InjectModel(Polygon.name)
    private readonly PolygonModule: Model<PolygonDocument>,
  ) {}

  async delMarker(currentId: string, Slog: string): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reg = await this.MarkerModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await this.MarkerModule.deleteOne({ _id: reg['_id'] });
    throw new HttpException('delete animal', HttpStatus.OK);
  }

  async upMarker(
    currentId: string,
    createMarkerDto: CreateMarkerDto,
    Slog: string,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reg = await this.MarkerModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const animal = Object.assign(reg, createMarkerDto);
    animal['Slog'] = MapService.slugAt(animal['name']);
    await this.MarkerModule.replaceOne({ _id: animal['_id'] }, animal, {
      upsert: false,
    });
    throw new HttpException('update animal', HttpStatus.OK);
  }

  async getMarkers(): Promise<PointsInterface> {
    const imp = await this.MarkerModule.find();
    return { markers: imp };
  }

  async createMarker(
    currentId: string,
    createMarkerDto: CreateMarkerDto,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const mark = Object.assign(new Marker(), createMarkerDto);
    await new this.MarkerModule(mark).save();
    throw new HttpException('add marker', HttpStatus.OK);
  }

  async delPolygon(currentId: string, Slog: string): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reg = await this.PolygonModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await this.PolygonModule.deleteOne({ _id: reg['_id'] });
    throw new HttpException('delete animal', HttpStatus.OK);
  }

  async upPolygon(
    currentId: string,
    createPolygonDto: CreatePolygonDto,
    Slog: string,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reg = await this.PolygonModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const animal = Object.assign(reg, createPolygonDto);
    animal['Slog'] = MapService.slugAt(animal['name']);
    await this.PolygonModule.replaceOne({ _id: animal['_id'] }, animal, {
      upsert: false,
    });
    throw new HttpException('update animal', HttpStatus.OK);
  }

  async getPolygon(): Promise<PolygonInterface> {
    const imp = await this.PolygonModule.find();
    return { polygons: imp };
  }

  async createPolygon(
    currentId: string,
    createPolygonDto: CreatePolygonDto,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const poli = Object.assign(new Polygon(), createPolygonDto);
    await new this.PolygonModule(poli).save();
    throw new HttpException('add polygon', HttpStatus.OK);
  }

  private static slugAt(title: string): string {
    return slugify(title, { lower: true });
  }
}
