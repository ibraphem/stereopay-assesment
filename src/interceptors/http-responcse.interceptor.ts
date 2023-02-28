import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';
import { ValidationException } from 'src/exceptions/validation.exception';


@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          status: 'success',
          message: 'Request successful',
          data,
        };
      }),
      catchError((error) => {
        const response = context.switchToHttp().getResponse<Response>();
        const exception = this.mapErrorToResponse(error);

        response.status(exception.getStatus()).json({
          status: 'error',
          message: error?.response?.statusCode === 400 ? "Validation Errors" : error?.response?.statusCode === 404 ? error?.response?.message : "Internal Server Error",
          data: exception.getResponse(),
        });

        return throwError(error);
      }),
    );
  }

  private mapErrorToResponse(error: any): HttpException {
    if (error instanceof HttpException) {
      return error;
    } else if (error instanceof NotFoundException) {
      return new HttpException(
        {
          status: 'error',
          message: error.message,
          data: {},
        },
        404,
      );
    } else if (error instanceof ValidationException) {
      return new HttpException(
        {
          status: 'error',
          message: 'Validation failed',
          data: error,
        },
        422,
      );
    } else {
      return new HttpException(
        {
          status: 'error',
          message: 'Internal server error',
          data: null,
        },
        500,
      );
    }
  }
}
