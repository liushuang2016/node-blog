import * as mongoose from "mongoose";
const Schema = mongoose.Schema

const TagSchema = new Schema({
  tag: { type: String, unique: true },
  ct: { type: Date, default: Date.now }
})

export const Tag = mongoose.model('tag', TagSchema)
