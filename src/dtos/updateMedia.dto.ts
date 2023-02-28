import { mediaStatus } from 'src/utils/enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateMediaDto {

    @IsNotEmpty()
    @IsEnum(mediaStatus)
    status: mediaStatus;
  
  }