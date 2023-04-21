import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class BackPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);
    if (typeof object !== 'object') {
      return value;
    }
    const error = await validate(object);
    if (error.length === 0) {
      return value;
    }

    throw new HttpException(
      { errors: this.format(error) },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  format(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints);
      return acc;
    }, {});
  }
}
