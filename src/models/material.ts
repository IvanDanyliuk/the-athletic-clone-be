import { Schema, model, InferSchemaType } from 'mongoose';


const materialSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true },
  title: { type: String },
  content: { type: String, required: true },
  preview: { type: String },
  image: { type: String },
  isMain: { type: Boolean },
  status: { type: String, required: true },
  publicationDate: { type: String, required: true },
  views: { type: Number, required: true },
  likes: [{ type: String }],
  comments: [{
    id: { type: String },
    userId: { type: String },
    userImage: { type: String },
    userName: { type: String }, 
    message: { type: String }
  }],
  labels: { type: [String], required: true },
}, {
  timestamps: true
});

export type MaterialType = InferSchemaType<typeof materialSchema>;

export default model<MaterialType>('Material', materialSchema);