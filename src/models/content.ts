import { Schema, model, InferSchemaType } from 'mongoose';

const contentSectionSchema = new Schema({
  name: { type: String, required: true },
  maxLength: { type: String, required: true },
  materials: [{ type: Schema.Types.ObjectId, ref: 'Material' }]
}, {
  timestamps: true
});

export type ContentSectionType = InferSchemaType<typeof contentSectionSchema>;

export default model<ContentSectionType>('ContentLabel', contentSectionSchema);