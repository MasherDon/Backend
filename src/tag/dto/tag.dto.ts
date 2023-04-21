import { IsNotEmpty } from 'class-validator';

export class CreateTag {
  @IsNotEmpty()
  readonly name: string;
}
