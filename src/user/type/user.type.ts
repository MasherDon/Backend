import { User } from '../schemas/user.schema';

export type userType = Omit<User, 'password'>;
