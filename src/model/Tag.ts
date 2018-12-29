import * as mongoose from "mongoose";
const Schema = mongoose.Schema

export const TagSchema = new Schema({
  tag: { type: String, unique: true },
  ct: { type: Date, default: Date.now }
})

export interface TagInterface extends mongoose.Document {
  tag: string,
  ct: string
}
