import { Schema, model, InferSchemaType } from 'mongoose';

const contentLabelSchema = new Schema({
  name: { type: String, required: true },
  maxLength: { type: String, required: true }
}, {
  timestamps: true
});

export type ContentLabelType = InferSchemaType<typeof contentLabelSchema>;

export default model<ContentLabelType>('ContentLabel', contentLabelSchema);