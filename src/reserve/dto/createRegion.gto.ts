import { IsNotEmpty } from 'class-validator';

export class CreateReserveDto {
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
  readonly intro: string;
  @IsNotEmpty()
  readonly map: string;
  readonly reserves: [];
}
