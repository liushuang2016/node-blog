import * as mongoose from "mongoose";

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const CommentSchema = new Schema({
  author: { type: ObjectId, required: true, ref: 'user' },
  postId: { type: ObjectId, required: true, ref: 'post' },
  content: { type: String, required: true },
  ct: { type: Date, default: Date.now }
})

export interface CommentInterface extends mongoose.Document {
  author: string | any,
  postId: string | any,
  content: string,
  ct: string
}

export const CommentModel = mongoose.model<CommentInterface>('comment', CommentSchema)
