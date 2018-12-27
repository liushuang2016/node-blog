import * as mongoose from "mongoose";

const Schema = mongoose.Schema

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  pv: { type: Number, default: 0 },
  tags: { type: Array, required: true },
  ct: { type: Date, default: Date.now },
  ut: { type: Date, default: Date.now },
  _delete: { type: Boolean, default: false }
})

export interface PostEntity {
  author: mongoose.Schema.Types.ObjectId;
  title: string;
  pv: number;
  tags: string[];
  ct: string;
  ut: string;
  _delete: boolean;
}

export const Post = mongoose.model('post', PostSchema)
