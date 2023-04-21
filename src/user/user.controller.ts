import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { UserDecorator } from '../decoretors/userDecorator';
import { userInterface } from './interface/user.interface';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { BackPipe } from '../pipes/back.pipe';
import { ValidUserDto } from './dto/validUser.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new BackPipe())
  async createUser(
    @Body('user') userDto: CreateUserDto,
  ): Promise<userInterface> {
    const user = await this.userService.createUser(userDto);
    return this.userService.buildUser(user);
  }

  @Post('users/login')
  @UsePipes(new BackPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<userInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUser(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async CurrentUser(@UserDecorator() user: User): Promise<userInterface> {
    return this.userService.buildUser(user);
  }

  @Get('user/:username/:rights')
  @UseGuards(AuthGuard)
  async setRights(
    @UserDecorator() user: User,
    @Param('rights') rights: number,
    @Param('username') username: string,
  ): Promise<HttpException> {
    return this.userService.setRights(user, rights, username);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async updateUser(
    @UserDecorator('username') username: string,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<userInterface> {
    const user = await this.userService.updateUser(username, updateUserDto);
    return this.userService.buildUser(user);
  }

  @Get('users/:email')
  async recoverUser(@Param('email') email: string): Promise<HttpException> {
    return await this.userService.recoverUser(email);
  }

  @Put('user/:email')
  @UsePipes(new BackPipe())
  async validUser(
    @Param('email') email: string,
    @Body('user') validUserDto: ValidUserDto,
  ): Promise<userInterface> {
    const user = await this.userService.validUser(email, validUserDto);
    return this.userService.buildUser(user);
  }

  @Get('user/:email')
  async testUser(@Param('email') email: string): Promise<HttpException> {
    return this.userService.testUser(email);
  }
}
