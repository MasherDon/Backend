import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHome() {
    return true;
  }
}
