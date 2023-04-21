import { IsNotEmpty } from 'class-validator';

export class CreatePolygonDto {
  @IsNotEmpty()
  readonly paths: number[][];
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly image: string;
  @IsNotEmpty()
  readonly info: string;
  readonly icon: string;
  readonly Slog: string;
  readonly fillColor: string;
  readonly strokeColor: string;
}
