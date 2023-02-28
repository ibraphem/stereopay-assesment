import { IsNotEmpty } from 'class-validator';
import { mediaStatus, mediaType } from 'src/utils/enums';
import { IsEnum } from 'class-validator';


export class CreateMediaDto {

  @IsEnum(mediaType)
  @IsNotEmpty()
  type: mediaType;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(mediaStatus)
  status: mediaStatus;

  url: string;



}
