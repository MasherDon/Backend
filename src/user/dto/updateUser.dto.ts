import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  readonly bio?: string;
  @IsNotEmpty()
  image: string;
  readonly password?: string;
}
