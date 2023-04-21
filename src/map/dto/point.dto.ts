import { IsNotEmpty } from 'class-validator';

export class CreateMarkerDto {
  @IsNotEmpty()
  readonly lat: number;
  @IsNotEmpty()
  readonly lng: number;
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly image: string;
  @IsNotEmpty()
  readonly info: string;
  readonly icon: string;
  readonly Slog: string;
}
