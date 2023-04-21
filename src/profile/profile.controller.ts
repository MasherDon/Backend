import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserDecorator } from '../decoretors/userDecorator';
import { ProfileInterface } from './interface/profile.interface';
import { AuthGuard } from '../guards/auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @UserDecorator('_id') currentUser: string,
  ): Promise<ProfileInterface> {
    const profile = await this.profileService.getProfile(username);
    return this.profileService.buildProfile(profile, currentUser);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async favorites(
    @Param('username') username: string,
    @UserDecorator('_id') currentUser: string,
  ): Promise<ProfileInterface> {
    const article = await this.profileService.favorites(username, currentUser);
    return await this.profileService.buildProfile(article, currentUser);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async favoritesDelete(
    @Param('username') username: string,
    @UserDecorator('_id') currentUser: string,
  ): Promise<ProfileInterface> {
    const article = await this.profileService.favoritesDelete(
      username,
      currentUser,
    );
    return await this.profileService.buildProfile(article, currentUser);
  }
}
