import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Region, RegionDocument } from './schema/region.schema';
import { regionsInterface } from './interface/refions.interface';
import { regionInterface } from './interface/refion.interface';
import { CreateRegionDto } from './dto/createRegion.gto';
import { User, UserDocument } from '../user/schemas/user.schema';
import slugify from 'slugify';
import { Polygon, PolygonDocument } from '../map/schema/mapPoligon.schema';
import { Animal, AnimalDocument } from '../animal/schema/animal.schema';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(Region.name)
    private readonly RegionModule: Model<RegionDocument>,
    @InjectModel(Polygon.name)
    private readonly PolygonModule: Model<PolygonDocument>,
    @InjectModel(User.name)
    private readonly UserModule: Model<UserDocument>,
    @InjectModel(Animal.name)
    private readonly AnimalModule: Model<AnimalDocument>,
  ) {}

  async getRegions(nam: number): Promise<regionsInterface> {
    const regions = await this.RegionModule.find();
    let regi = [];
    const namb = Number(nam);
    if (namb === 0) {
      if (regions.length > 5) {
        for (let a = 0; a < 5; a++) {
          regi.push(regions[a]);
        }
      } else {
        regi = regions;
      }
    } else {
      const not =
        regions.length > (namb + 1) * 5 ? (namb + 1) * 5 : regions.length;
      for (let a = namb * 5; a < not; a++) {
        regi.push(regions[a]);
      }
    }
    return { regions: regi };
  }

  async delRegion(Slog: string, currentId: string): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reg = await this.RegionModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await this.RegionModule.deleteOne({ _id: reg['_id'] });
    throw new HttpException('delete animal', HttpStatus.OK);
  }

  async upRegion(
    currentId: string,
    createAnimalDto: CreateRegionDto,
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
    const reg = await this.RegionModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const animal = Object.assign(reg, createAnimalDto);
    animal['Slog'] = RegionService.slugAt(animal['name']);
    await this.RegionModule.replaceOne({ _id: animal['_id'] }, animal, {
      upsert: false,
    });
    throw new HttpException('updete animal', HttpStatus.OK);
  }

  async getRegion(Slog: string): Promise<regionInterface> {
    const region = await this.RegionModule.findOne({ Slog: Slog });
    if (!region) {
      throw new HttpException('notFound', HttpStatus.NOT_FOUND);
    }
    const reserves = [];
    const animals = [];
    if (region['reserves'].length > 0) {
      for (const x in region['reserves']) {
        reserves.push(await this.PolygonModule.findById(region['reserves'][x]));
      }
    }
    if (region['animals'].length > 0) {
      for (const x in region['animals']) {
        animals.push(await this.AnimalModule.findById(region['animals'][x]));
      }
    }
    return {
      region: {
        ...region['_doc'],
        reserves: reserves,
        animals: animals,
      },
    };
  }

  async createRegion(
    currentId: string,
    createRegionDto: CreateRegionDto,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const region = Object.assign(new Region(), createRegionDto);
    region['Slog'] = RegionService.slugAt(region['name']);
    const reg = await this.RegionModule.findOne({
      Slog: region['Slog'],
    });
    if (reg) {
      error.errors['Slog'] = 'Slog уже существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await new this.RegionModule(region).save();
    throw new HttpException('add region', HttpStatus.OK);
  }

  private static slugAt(title: string): string {
    return slugify(title, { lower: true });
  }
}
