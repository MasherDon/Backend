import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/updateUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { userInterface } from './interface/user.interface';
import { JwtSecret } from './config';
import { hash, compare } from 'bcrypt';
import { LoginUserDto } from './dto/loginUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { userType } from './type/user.type';
import { Recover, RecoverDocument } from './schemas/recover.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { ValidUserDto } from './dto/validUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModule: Model<UserDocument>,
    @InjectModel(Recover.name)
    private readonly RecoverModule: Model<RecoverDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<userType> {
    const error = {
      errors: {},
    };
    if (userDto.username.length > 30 || userDto.username.length < 8) {
      error.errors['username'] = 'некорректное имя';
    }
    if (
      userDto.password.length > 30 ||
      userDto.password.length < 8 ||
      this.passwordValid(userDto.password)
    ) {
      error.errors['password'] = 'некорректный пароль';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const userByEmail = await this.UserModule.findOne({
      email: userDto.email,
    });
    const userByName = await this.UserModule.findOne({
      username: userDto.username,
    });
    if (userByEmail) {
      error.errors['email'] = 'уже используется';
    }
    if (userByName) {
      error.errors['username'] = 'уже используетя';
    }
    if (userByEmail || userByName) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const pos = Object.assign(new User(), userDto);
    pos['password'] = await hash(pos['password'], 10);
    return await new this.UserModule(pos).save();
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<userType> {
    const error = {
      errors: {},
    };
    const user = await this.UserModule.findOne({ email: loginUserDto.email });
    if (!user) {
      error.errors['email'] = 'неверный email';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const isPasCor = await compare(loginUserDto['password'], user['password']);
    if (!isPasCor) {
      error.errors['password'] = 'неверный password';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (user['rights'] === 4) {
      error.errors['rights'] = 'пользователь заблоктрован';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return user;
  }

  async setRights(
    user: User,
    rights: number,
    username: string,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    rights = Number(rights);
    const userIs = await this.UserModule.findOne({ username: username });
    if (!userIs) {
      error.errors['username'] = 'не найдено';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (rights === userIs['rights']) {
      error.errors['rights'] = 'уже обладет статусом';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (rights === 1) {
      if (user.rights === 0) {
        await this.UserModule.updateOne(
          { username: username },
          { $set: { rights: rights } },
        );
        error.errors['rights'] = 'статус установлен';
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      } else {
        error.errors['rights'] = 'не достаточно прав';
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    if (rights === 2) {
      if (user.rights < 2 && userIs['rights'] > 2) {
        await this.UserModule.updateOne(
          { username: username },
          { $set: { rights: rights } },
        );
        error.errors['rights'] = 'статус установлен';
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      } else {
        error.errors['rights'] = 'не достаточно прав';
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    if (rights === 3) {
      if (user.rights < 2) {
        await this.UserModule.updateOne(
          { username: username },
          { $set: { rights: rights } },
        );
        error.errors['rights'] = 'статус установлен';
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      } else {
        error.errors['rights'] = 'не достаточно прав';
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    if (rights === 4) {
      if (user.rights < 2) {
        await this.UserModule.updateOne(
          { username: username },
          { $set: { rights: rights } },
        );
        error.errors['rights'] = 'статус установлен';
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      } else {
        error.errors['rights'] = 'не достаточно прав';
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    if (rights < 1 || rights > 4) {
      error.errors['rights'] = 'нет такого статуса';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    } else {
      throw new HttpException('ok', HttpStatus.OK);
    }
  }

  async updateUser(
    username: string,
    updateUserDto: UpdateUserDto,
  ): Promise<userType> {
    const error = {
      errors: {},
    };
    if (updateUserDto.image[updateUserDto.image.length - 1] === '?') {
      error.errors['image'] = 'некорректное изображение';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (updateUserDto.password) {
      if (
        updateUserDto.password.length > 30 ||
        updateUserDto.password.length < 8 ||
        this.passwordValid(updateUserDto.password)
      ) {
        error.errors['password'] = 'не корректный password';
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    const user = await this.findName(username);
    if (user['rights'] === 4) {
      error.errors['rights'] = 'пользователь заблоктрован';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    Object.assign(user, updateUserDto);
    if (updateUserDto.password) {
      user['password'] = await hash(user['password'], 10);
    }
    await this.UserModule.findByIdAndUpdate(user['_id'], user);
    return user;
  }

  async findName(username: string): Promise<userType> {
    const error = {
      errors: {
        username: 'не найдено',
      },
    };
    const out = await this.UserModule.findOne({ username: username });
    if (!out) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return out;
  }

  async validUser(
    email: string,
    validUserDto: ValidUserDto,
  ): Promise<userType> {
    const error = {
      errors: {},
    };
    const out = await this.UserModule.findOne({ email: email });
    if (!out) {
      error.errors['email'] = 'email не найден';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (out['rights'] === 4) {
      error.errors['rights'] = 'пользователь заблоктрован';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const inp = await this.RecoverModule.findOne({ email: email });
    if (!inp) {
      error.errors['email'] = 'email без запроса подтверждения';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (
      new Date(inp['date']) <
      new Date(Date.now() + 7 * 60 * 60 * 1000 - 10 * 60 * 1000)
    ) {
      await this.RecoverModule.deleteOne({ email: email });
      error.errors['code'] = 'срок действия кода истек';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (validUserDto.code !== inp['code']) {
      error.errors['code'] = 'код недействителен';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (
      validUserDto.password.length > 30 ||
      validUserDto.password.length < 8 ||
      this.passwordValid(validUserDto.password)
    ) {
      error.errors['password'] = 'не коректынй password';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    out['password'] = await hash(validUserDto.password, 10);
    await this.UserModule.findByIdAndUpdate(out['_id'], out);
    await this.RecoverModule.deleteOne({ email: email });
    return out;
  }

  async recoverUser(email: string): Promise<HttpException> {
    const error = {
      errors: {},
    };
    const out = await this.UserModule.findOne({ email: email });
    if (!out) {
      error.errors['email'] = 'email не найден';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (out['rights'] === 4) {
      error.errors['rights'] = 'пользователь заблоктрован';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const inp = await this.RecoverModule.findOne({ email: email });
    if (inp) {
      error.errors['email'] =
        'письмо уже отправлено. сообщение действительно 10 минут';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const code = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    await this.mailerService
      .sendMail({
        to: email,
        from: '',
        subject: 'Вход в Red book для User: ' + out['username'], // Subject line
        text: 'код смены пароля',
        html:
          'код смены пароля: ' +
          code +
          `\n<a href="http://192.168.0.103:8080/recovery/${email}/${code}">Ссылка<a/>`,
      })
      .then((success) => {
        //console.log(success);
      })
      .catch((err) => {
        error.errors['email'] = 'email не найдена';
        new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        //console.log(err);
      });
    const pos = new Recover();
    pos['email'] = email;
    pos['date'] = new Date(Date.now() + 7 * 60 * 60 * 1000);
    pos['code'] = code;
    await new this.RecoverModule(pos).save();
    throw new HttpException('ok', HttpStatus.OK);
  }

  async testUser(email: string): Promise<HttpException> {
    const inp = await this.RecoverModule.findOne({ email: email });
    if (inp) {
      throw new HttpException('ok', HttpStatus.OK);
    } else {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  passwordValid(password: string): boolean {
    return !!password.match(/\W+/g);
  }

  generateJwt(user: userType) {
    return sign(
      {
        _id: user['_id'],
        username: user['username'],
        email: user['email'],
      },
      JwtSecret,
    );
  }

  buildUser(user: userType): userInterface {
    const error = {
      errors: {},
    };
    user['password'] = undefined;
    if (user['rights'] === 4) {
      error.errors['rights'] = 'пользователь заблоктрован';
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return {
      user: {
        ...user['_doc'],
        token: this.generateJwt(user),
      },
    };
  }
}
