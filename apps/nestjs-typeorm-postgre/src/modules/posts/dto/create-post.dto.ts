import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(3)
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  content: string;
}
