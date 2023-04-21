import { IsNotEmpty } from 'class-validator';

export class ValidUserDto {
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  readonly code: string;
}
