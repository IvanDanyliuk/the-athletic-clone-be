import { Schema, model, InferSchemaType } from 'mongoose';


const materialSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' }, 
  title: { type: String },
  text: { type: String, required: true },
  image: { type: String },
  views: { type: Number, required: true },
  likes: { type: Number, required: true },
  comments: {
    user: { type: String }, 
    message: { type: String }
  },
  labels: { type: [String], required: true },
}, {
  timestamps: true
});

type Material = InferSchemaType<typeof materialSchema>;

export default model<Material>('Material', materialSchema);