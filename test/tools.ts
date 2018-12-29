import * as mongoose from "mongoose";
import * as config from "config";

export function beforA() {
  mongoose.connect(config.get('mongodb'), {
    useNewUrlParser: true,
    useCreateIndex: true
  })
}

export function afterA() {
  mongoose.connection.close()
}
