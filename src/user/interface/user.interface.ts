import { userType } from '../type/user.type';

export interface userInterface {
  user: userType & { token: string };
}
