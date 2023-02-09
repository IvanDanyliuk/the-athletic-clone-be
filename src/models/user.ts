import { Schema, model, InferSchemaType } from 'mongoose';


const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userPhotoUrl: { type: String },
  role: { type: String, required: true },
  location: { type: String },
  position: { type: String }
}, {
  timestamps: true
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>('User', userSchema);