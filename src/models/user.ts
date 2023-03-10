import { Schema, model, InferSchemaType } from 'mongoose';


const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userPhotoUrl: { type: String },
  role: { type: String, required: true },
  location: { type: String },
  organization: { type: String },
  position: { type: String }
}, {
  timestamps: true
});

export type UserType = InferSchemaType<typeof userSchema>;

export default model<UserType>('User', userSchema);