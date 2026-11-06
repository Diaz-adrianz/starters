import {
  IsDate,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Gender } from '../../../enums/gender.enum';
import { Type } from 'class-transformer';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string | null;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date | null;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string | null;
}
