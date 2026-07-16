export class ResponseDto<T = undefined> {
  statusCode: number;
  message: string;
  data: T;
}
