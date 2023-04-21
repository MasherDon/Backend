import { IsNotEmpty } from 'class-validator';

export class AddAnimalDto {
  @IsNotEmpty()
  labels: [string];
  @IsNotEmpty()
  data: [number];
}
