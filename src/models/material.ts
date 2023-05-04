import { Schema, model, InferSchemaType } from 'mongoose';


const materialSchema = new Schema({
  author: { 
    name: { type: String, required: true },
    photoUrl: { type: String },
    organization: { type: String, required: true },
    position: { type: String, required: true },
   }, 
  type: { type: String, required: true },
  title: { type: String },
  content: { type: String, required: true },
  preview: { type: String },
  image: { type: String },
  isMain: { type: Boolean },
  status: { type: String, required: true },
  publicationDate: { type: String, required: true },
  views: { type: Number, required: true },
  likes: { type: Number, required: true },
  comments: [{
    user: { type: String }, 
    message: { type: String }
  }],
  labels: { type: [String], required: true },
}, {
  timestamps: true
});

export type MaterialType = InferSchemaType<typeof materialSchema>;

export default model<MaterialType>('Material', materialSchema);