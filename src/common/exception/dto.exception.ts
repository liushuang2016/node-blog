import { HttpException } from "@nestjs/common";

export class DtoException extends HttpException {
  constructor(message: string, error = 'dto error') {
    super({
      message,
      error
    }, 444)
  }
}
