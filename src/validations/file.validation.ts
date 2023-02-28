import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { mediaType } from 'src/utils/enums';


@ValidatorConstraint({ name: 'FileValidation', async: false })
export class FileValidation implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const { object } = args;
    if (object.type === mediaType.image) {
      return value && value.mimetype.startsWith('image/');
    } else if (object.type === mediaType.audio) {
      return value && value.mimetype.startsWith('audio/');
    }
    return false;
  }

  defaultMessage() {
    return 'File is invalid';
  }
}
