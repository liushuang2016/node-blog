export class ResJson {
  constructor({ data = null, code = 200, msg = '' }) {
    return {
      data,
      code,
      msg,
      status: code,
      time: Date.now()
    }
  }
}
