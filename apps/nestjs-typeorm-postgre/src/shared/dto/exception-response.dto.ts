export class ExceptionResponseDto {
  statusCode: number;
  message: string;
  errors?: { field: string; errors: string[] }[];
}
