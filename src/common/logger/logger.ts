import { format, createLogger, transports } from "winston";
import * as path from "path";

const logpath = (name: string): string => {
  return path.join(__dirname, '..', '..', '..', 'logs', name)
}

export const logger = createLogger({
  format: format.json(),
  transports: [
    // new transports.Console(),
    new transports.File({ filename: logpath('error.log'), level: 'error' }),
    new transports.File({ filename: logpath('warn.log'), level: 'warn' }),
    // new transports.File({ filename: logpath('info.log'), level: 'info' })
  ]
})

export const httpErrorLogger = function (req, res, error) {
  const path = req.path
  const params = JSON.stringify(req.params)
  const query = JSON.stringify(req.query)
  const body = JSON.stringify(req.body)
  const ip = req.ip
  const method = req.method
  const err = JSON.stringify(error)
  const str = `ip: ${ip}, path: ${path}, method: ${method}, params: ${params}, query: ${query}, body: ${body}, err: ${err}`
  if (process.env.NODE_ENV !== 'production') {
    console.error(str)
  }
  logger.error(str)
}
