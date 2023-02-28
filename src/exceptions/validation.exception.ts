import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(errors: string[]) {
    super({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Validation failed',
      errors,
    }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}