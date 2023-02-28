import {
  Body,
  UseInterceptors,
  Controller,
  Get,
  Post,
  UploadedFile,
  HttpCode,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Param,
  ParseIntPipe,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateMediaDto } from 'src/dtos/createMedia.dto';
import { MediaService } from 'src/media/services/media/media.service';
import { BASE_URL } from 'src/utils/settings';
import { UpdateMediaDto } from 'src/dtos/updateMedia.dto';
import { FileCleanupInterceptor,  } from 'src/interceptors/fileCleanup.interceptor';


@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get('search')
   search(@Query('query') query: string) {
    return this.mediaService.search(query);
  }

  @Get(':id')
   getMediaById(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.fetchMediaById(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  updateMediaById(@Param('id') id: number, @Body() updateMediaDto: UpdateMediaDto,
  ) {
   return this.mediaService.updateMedia(id, updateMediaDto);
  }

  @Delete(':id')
   softDeleteById(@Param('id') id: number) {
    return this.mediaService.softDelete(id);
  }

  @Get()
   getMedia(@Query('page') page = 1, @Query('perPage') perPage = 12) {
    return this.mediaService.fetchMedia(page, perPage);
  }



  @Post()
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) =>{
          let folder = req.body?.type === "image" ? "images" : "audios"
          
              callback(null, `uploads/${folder}`)
         
      },     
      filename: (req, file, callback) => {
        const uniqueFilename =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const fileName = `${uniqueFilename}${ext}`;
        let folder = req.body?.type === "image" ? "images" : "audios"
        req['filename'] = fileName;
        req['folder'] = folder
        
        callback(null, fileName);
      },   
    },
    ), 

    fileFilter: (req, file, cb) => { 
      if (req.body.type === "image" && !file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException(`An image file is expected`), false);
      }
      if (req.body.type === "audio" && !file.originalname.match(/\.(mp3|mpeg|wav)$/)) {
        return cb(new BadRequestException(`An audio file is expected`), false);
      }
      return cb(null, true);
    },
  },

  ), FileCleanupInterceptor
  )
  addMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMediaDto: CreateMediaDto,
  ) {

    if(!file){
      throw new BadRequestException(`File is required`);
    }
    
    
    const url = `${BASE_URL}/uploads/${createMediaDto.type}/${file?.filename}`;
    const dto = new CreateMediaDto();
    dto.url = url;
    dto.name = createMediaDto.name;
    dto.description = createMediaDto.description;
    dto.status = createMediaDto.status;
    dto.type = createMediaDto.type;

    return this.mediaService.createMedia(dto);
  }

}
