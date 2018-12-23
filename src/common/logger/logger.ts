import { format, createLogger, transports } from "winston";
import * as path from "path";

const logpath = (name: string): string => {
  return path.join(__dirname, '..', '..', '..', 'logs', name)
}

export const logger = createLogger({
  format: format.simple(),
  transports: [
    // new transports.Console(),
    new transports.File({ filename: logpath('error.log'), level: 'error' }),
    new transports.File({ filename: logpath('warn.log'), level: 'warn' }),
    // new transports.File({ filename: logpath('info.log'), level: 'info' })
  ]
})

