import { Schema, model, InferSchemaType } from 'mongoose';


const competitionSchema = new Schema({
  fullName: { type: String, required: true },
  shortName: { type: String, required: true },
  country: { type: String, required: true },
  clubs: [{ type: Schema.Types.Mixed, ref: 'Club' }],
  logoUrl: { type: String },
  type: { type: String, required: true },
}, {
  timestamps: true
});

export type CompetitionType = InferSchemaType<typeof competitionSchema>;

export default model<CompetitionType>('Competition', competitionSchema);