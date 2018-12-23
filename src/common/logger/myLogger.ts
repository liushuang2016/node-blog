import { Logger } from '@nestjs/common';
import { logger } from "./logger";


export class MyLogger extends Logger {
  log(message: string) {
    logger.info(message)
    super.log(message)
  }
  error(message: string, trace: string) {
    logger.error(message, trace)
    super.error(message, trace)
  }
  warn(message: string) {
    super.warn(message)
  }
}
