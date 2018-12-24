import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  role: { type: Number, default: 10 }
})

export const User = mongoose.model('user', UserSchema)
