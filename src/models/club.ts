import { Schema, model, InferSchemaType } from 'mongoose';


const clubSchema = new Schema({
  fullName: { type: String, required: true },
  commonName: { type: String, required: true },
  shortName: { type: String, required: true },
  country: { type: String, required: true },
  clubLogoUrl: { type: String },
  stadium: { type: String }
}, {
  timestamps: true
});

export type ClubType = InferSchemaType<typeof clubSchema>;

export default model<ClubType>('Club', clubSchema);