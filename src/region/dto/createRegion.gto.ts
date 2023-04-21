import { IsNotEmpty } from 'class-validator';

export class CreateRegionDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly info: string;
  @IsNotEmpty()
  readonly put: string;
  @IsNotEmpty()
  readonly lat: number;
  @IsNotEmpty()
  readonly lng: number;
  @IsNotEmpty()
  readonly map: string;
  @IsNotEmpty()
  readonly intro: string;
  readonly reserves: [];
  readonly animals: [];
}
