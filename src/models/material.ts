import { Schema, model, InferSchemaType } from 'mongoose';


const materialSchema = new Schema({
  author: { type: String, required: true }, //should be changed according to the User model (needs to be a link to the User model)
  title: { type: String },
  text: { type: String, required: true },
  image: { type: String },
  views: { type: Number, required: true },
  likes: { type: Number, required: true },
  comments: {
    user: { type: String }, //should be changed according to the User model (needs to be a link to the User model)
    message: { type: String }
  },
  labels: { type: [String], required: true },
}, {
  timestamps: true
});

type Material = InferSchemaType<typeof materialSchema>;

export default model<Material>('Material', materialSchema);