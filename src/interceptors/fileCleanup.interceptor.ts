import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { unlink } from 'fs';
  
  @Injectable()
  export class FileCleanupInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest();
      const filename = req['filename'];
      const folder = req['folder'];
  
      return next.handle().pipe(
        tap(null, () => {
          if (filename) {
            // Delete the uploaded file from the server
            unlink(`uploads/${folder}/${filename}`, (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log(`Deleted file: ${filename}`);
              }
            });
          }
        }),
      );
    }
  }
  