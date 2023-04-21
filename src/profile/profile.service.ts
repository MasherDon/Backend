import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { ProfileInterface } from './interface/profile.interface';
import { userType } from '../user/type/user.type';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private readonly UserModule: Model<UserDocument>,
  ) {}

  private static idString(currentUser: string): string {
    return String(currentUser).split('"')[0];
  }

  async getProfile(username: string): Promise<userType> {
    const profile = await this.UserModule.findOne({ username: username });
    if (!profile) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  async favorites(username: string, currentUser: string): Promise<userType> {
    const profile = await this.getProfile(username);
    if (
      !profile['fallowing'].includes(ProfileService.idString(currentUser)) &&
      profile['_id'] !== currentUser
    ) {
      return this.UserModule.findOneAndUpdate(
        { username: username },
        {
          $push: { fallowing: ProfileService.idString(currentUser) },
        },
      );
    }
    return profile;
  }

  async favoritesDelete(
    username: string,
    currentUser: string,
  ): Promise<userType> {
    const profile = await this.getProfile(username);
    if (profile['fallowing'].includes(ProfileService.idString(currentUser))) {
      return this.UserModule.findOneAndUpdate(
        { username: username },
        {
          $pull: { fallowing: ProfileService.idString(currentUser) },
        },
      );
    }
    return profile;
  }

  async buildProfile(
    profile: userType,
    currentUser: string,
  ): Promise<ProfileInterface> {
    profile['password'] = undefined;
    profile['email'] = undefined;
    profile['_id'] = undefined;
    return {
      profile: {
        ...profile['_doc'],
        fallowing: profile['fallowing'].includes(
          ProfileService.idString(currentUser),
        ),
      },
    };
  }
}
