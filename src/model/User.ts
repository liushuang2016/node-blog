import * as mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ip: { type: String, required: true },
  avatar: { type: String, default: 'default.jpg' },
  role: { type: Number, default: 10 },
  ct: { type: Date, default: Date.now }
})

export interface UserInterface extends mongoose.Document {
  name: string,
  password: string,
  ip: string,
  avatar: string,
  role: number,
  ct: string
}

export const UserModel = mongoose.model<UserInterface>('user', UserSchema)
