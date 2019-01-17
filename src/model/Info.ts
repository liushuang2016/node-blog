import * as mongoose from "mongoose";

const Schema = mongoose.Schema

export const InfoSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed },
  number: { type: Number, default: 0 }
})

export interface InfoInterface extends mongoose.Document {
  key: string,
  value: any,
  number: number
}

export const InfoModel = mongoose.model<InfoInterface>('info', InfoSchema)
