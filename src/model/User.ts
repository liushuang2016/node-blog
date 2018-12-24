import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'default.jpg' },
  role: { type: Number, default: 10 }
})

export const User = mongoose.model('user', UserSchema)
