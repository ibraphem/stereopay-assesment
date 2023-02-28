import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateMediaDto } from 'src/dtos/createMedia.dto';


@Injectable()
export class ValidationInterceptor implements NestInterceptor {
    // constructor(private readonly file: any) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const body = context.switchToHttp().getRequest().body;
    const dto = plainToClass(CreateMediaDto, body);
    const errors = await validate(dto);

    if (errors.length > 0) {
        const errorMessages = errors.map(error => Object.values(error.constraints)).flat();
        const errorMessage = `Validation failed: ${errorMessages.join(', ')}`;
        throw new BadRequestException({
          status: 'error',
          message: errorMessage,
          data: null,
        });
    }

    return next.handle().pipe(
      tap(() => {
        console.log('ValidationInterceptor - response is about to be sent');
      }),
    );
  }
}
