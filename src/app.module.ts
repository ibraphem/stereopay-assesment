import {  Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';
import { Media } from './typeorm/entities/media';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express/multer';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpResponseInterceptor } from './interceptors/http-responcse.interceptor';
import { ValidationInterceptor } from './interceptors/validation.interceptor';




@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: "root",
    password: "",
    database: 'stereoPayAssesmentDb',
    entities: [Media],
    synchronize: false, 
  }), 
  MediaModule,
  MulterModule.register({dest: './uploads',}),
      ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
],
  controllers: [AppController],
  providers: [
    AppService,
    ValidationInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
      
    },
  ],
})
export class AppModule {}
