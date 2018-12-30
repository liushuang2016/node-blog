import * as mongoose from "mongoose";
import * as config from "config";
import { async } from "rxjs/internal/scheduler/async";

export function connection() {
  mongoose.connect(config.get('mongodb'), {
    useNewUrlParser: true,
    useCreateIndex: true
  })
}

export function closeConnection() {
  mongoose.connection.close()
}

export function getTest(agent, path, cb) {
  return (done) => {
    return agent
      .get(path)
      .end((err, res) => {
        if (err) done(err)
        cb(res)
        done()
      })
  }
}
