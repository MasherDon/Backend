import { IsNotEmpty } from 'class-validator';

export class CreateAnimalDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  put: string;
  @IsNotEmpty()
  info: string;
  clas: [string];
  defend: [string];
  label: string;
}
