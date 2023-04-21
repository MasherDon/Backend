import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import slugify from 'slugify';
import { Animal, AnimalDocument } from './schema/animal.schema';
import { AnimalsInterface } from './interface/animals.interface';
import { AnimalInterface } from './interface/animal.interface';
import { CreateAnimalDto } from './dto/point.dto';
import { AddAnimalDto } from './dto/add.dto';

@Injectable()
export class AnimalService {
  constructor(
    @InjectModel(Animal.name)
    private readonly AnimalModule: Model<AnimalDocument>,
    @InjectModel(User.name)
    private readonly UserModule: Model<UserDocument>,
  ) {}

  async getAnimals(nam: number): Promise<AnimalsInterface> {
    const animals = await this.AnimalModule.find({
      clas: { $all: ['Животные'] },
    });
    let regi = [];
    const namb = Number(nam);
    if (namb === 0) {
      if (animals.length > 5) {
        for (let a = 0; a < 5; a++) {
          regi.push(animals[a]);
        }
      } else {
        regi = animals;
      }
    } else {
      const not =
        animals.length > (namb + 1) * 5 ? (namb + 1) * 5 : animals.length;
      for (let a = namb * 5; a < not; a++) {
        regi.push(animals[a]);
      }
    }
    return { animals: regi };
  }

  async getPlant(nam: number): Promise<AnimalsInterface> {
    const animals = await this.AnimalModule.find({
      clas: { $all: ['Растения'] },
    });
    let regi = [];
    const namb = Number(nam);
    if (namb === 0) {
      if (animals.length > 5) {
        for (let a = 0; a < 5; a++) {
          regi.push(animals[a]);
        }
      } else {
        regi = animals;
      }
    } else {
      const not =
        animals.length > (namb + 1) * 5 ? (namb + 1) * 5 : animals.length;
      for (let a = namb * 5; a < not; a++) {
        regi.push(animals[a]);
      }
    }
    return { animals: regi };
  }

  async getMushrooms(nam: number): Promise<AnimalsInterface> {
    const animals = await this.AnimalModule.find({
      clas: { $all: ['Грибы'] },
    });
    let regi = [];
    const namb = Number(nam);
    if (namb === 0) {
      if (animals.length > 5) {
        for (let a = 0; a < 5; a++) {
          regi.push(animals[a]);
        }
      } else {
        regi = animals;
      }
    } else {
      const not =
        animals.length > (namb + 1) * 5 ? (namb + 1) * 5 : animals.length;
      for (let a = namb * 5; a < not; a++) {
        regi.push(animals[a]);
      }
    }
    return { animals: regi };
  }

  async getAnimal(Slog: string): Promise<AnimalInterface> {
    const animal = await this.AnimalModule.findOne({ Slog: Slog });
    if (!animal) {
      throw new HttpException('notFound', HttpStatus.NOT_FOUND);
    }
    return { animal: animal };
  }

  async delAnimal(Slog: string, currentId: string): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reg = await this.AnimalModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await this.AnimalModule.deleteOne({ _id: reg['_id'] });
    throw new HttpException('delete animal', HttpStatus.OK);
  }

  async del(Slog: string, reserve: string, currentId: string) {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reg = await this.AnimalModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (reg['reserve'].indexOf(reserve) === -1) {
      error.errors['reserve'] = 'reserve не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const top = reg['reserve'].indexOf(reserve);
    const pop = [];
    for (let x = 0; x < reg['reserve'].length; x++) {
      if (x !== top) {
        pop.push(reg['reserve'][x]);
      }
    }
    reg['reserve'] = pop;
    await this.AnimalModule.replaceOne({ _id: reg['_id'] }, reg, {
      upsert: false,
    });
    throw new HttpException('add animal', HttpStatus.OK);
  }

  async add(
    Slog: string,
    reserve: string,
    currentId: string,
    addAnimalDto: AddAnimalDto,
  ) {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const reg = await this.AnimalModule.findOne({
      Slog: Slog,
    });
    console.log(reg);
    if (!reg) {
      error.errors['slug'] = 'slug не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (reg['reserve'].indexOf(reserve) === -1) {
      reg['reserve'].push(reserve);
      reg['labels'].push([]);
      reg['data'].push([]);
    }
    const top = reg['reserve'].indexOf(reserve);
    for (let x = 0; x < addAnimalDto.labels.length; x++) {
      if (reg['labels'][top].indexOf(addAnimalDto.labels[x]) === -1) {
        reg['labels'][top].push(addAnimalDto.labels[x]);
        reg['data'][top].push(addAnimalDto.data[x]);
      } else {
        reg['data'][top][reg['labels'][top].indexOf(addAnimalDto.labels[x])] =
          addAnimalDto.data[x];
      }
    }
    await this.AnimalModule.replaceOne({ _id: reg['_id'] }, reg, {
      upsert: false,
    });
    throw new HttpException('add animal', HttpStatus.OK);
  }

  async upAnimal(
    currentId: string,
    createAnimalDto: CreateAnimalDto,
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
    const reg = await this.AnimalModule.findOne({
      Slog: Slog,
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog не существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const animal = Object.assign(reg, createAnimalDto);
    animal['Slog'] = AnimalService.slugAt(animal['name']);
    await this.AnimalModule.replaceOne({ _id: animal['_id'] }, animal, {
      upsert: false,
    });
    throw new HttpException('updete animal', HttpStatus.OK);
  }

  async createAnimal(
    currentId: string,
    createAnimalDto: CreateAnimalDto,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findById(currentId);
    if (user['rights'] > 1) {
      error.errors['rights'] = 'недостаточно прав';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const animal = Object.assign(new Animal(), createAnimalDto);
    animal['Slog'] = AnimalService.slugAt(animal['name']);
    const reg = await this.AnimalModule.findOne({
      Slog: animal['Slog'],
    });
    if (!reg) {
      error.errors['Slog'] = 'Slog уже существует';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await new this.AnimalModule(animal).save();
    throw new HttpException('add animal', HttpStatus.OK);
  }

  private static slugAt(title: string): string {
    return slugify(title, { lower: true });
  }
}
