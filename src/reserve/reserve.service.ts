import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Reserve, ReserveDocument } from './schema/reserve.schema';
import slugify from 'slugify';
import { reserveInterface } from './interface/reserve.interface';
import { reservesInterface } from './interface/reserves.interface';
import { CreateReserveDto } from './dto/createRegion.gto';
import { Animal, AnimalDocument } from '../animal/schema/animal.schema';

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel(Reserve.name)
    private readonly ReserveModule: Model<ReserveDocument>,
    @InjectModel(User.name)
    private readonly UserModule: Model<UserDocument>,
    @InjectModel(Animal.name)
    private readonly AnimalModule: Model<AnimalDocument>,
  ) {}

  async getReserves(nam: number): Promise<reservesInterface> {
    const reserves = await this.ReserveModule.find();
    let regi = [];
    const namb = Number(nam);
    if (namb === 0) {
      if (reserves.length > 5) {
        for (let a = 0; a < 5; a++) {
          regi.push(reserves[a]);
        }
      } else {
        regi = reserves;
      }
    } else {
      const not =
        reserves.length > (namb + 1) * 5 ? (namb + 1) * 5 : reserves.length;
      for (let a = namb * 5; a < not; a++) {
        regi.push(reserves[a]);
      }
    }
    return { reserves: regi };
  }

  async delReserve(Slog: string, currentId: string): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reg = await this.ReserveModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await this.ReserveModule.deleteOne({ _id: reg['_id'] });
    throw new HttpException('delete res', HttpStatus.OK);
  }

  async upReserves(
    currentId: string,
    createReserveDto: CreateReserveDto,
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
    const reg = await this.ReserveModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const animal = Object.assign(reg, CreateReserveDto);
    animal['Slog'] = ReserveService.slugAt(animal['name']);
    await this.ReserveModule.replaceOne({ _id: animal['_id'] }, animal, {
      upsert: false,
    });
    throw new HttpException('update res', HttpStatus.OK);
  }

  async getReserve(Slog: string): Promise<reserveInterface> {
    const reserve = await this.ReserveModule.findOne({ Slog: Slog });
    if (!reserve) {
      throw new HttpException('notFound', HttpStatus.NOT_FOUND);
    }
    const animals = [];
    if (reserve['animals'].length > 0) {
      for (const x in reserve['animals']) {
        animals.push(await this.AnimalModule.findById(reserve['animals'][x]));
      }
    }
    return {
      reserve: {
        ...reserve['_doc'],
        animals: animals,
      },
    };
  }

  async createReserve(
    currentId: string,
    createReserveDto: CreateReserveDto,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reserve = Object.assign(new Reserve(), createReserveDto);
    reserve['Slog'] = ReserveService.slugAt(reserve['name']);
    const reg = await this.ReserveModule.findOne({
      Slog: reserve['Slog'],
    });
    if (reg) {
      error.errors['Slog'] = 'Slog уже существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await new this.ReserveModule(reserve).save();
    throw new HttpException('add reserve', HttpStatus.OK);
  }

  private static slugAt(title: string): string {
    return slugify(title, { lower: true });
  }
}
