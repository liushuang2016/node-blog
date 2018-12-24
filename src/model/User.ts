import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ip: { type: String, required: true },
  avatar: { type: String, default: 'default.jpg' },
  role: { type: Number, default: 10 },
  ct: { type: Date, default: Date.now() }
})

export const User = mongoose.model('user', UserSchema)
