import * as mongoose from "mongoose";

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
  author: { type: ObjectId, required: true, ref: 'user' },
  postId: { type: ObjectId, required: true, ref: 'post' },
  content: { type: String, required: true },
  ct: { type: Date, default: Date.now() }
})

export const Comment = mongoose.model('comment', CommentSchema)
