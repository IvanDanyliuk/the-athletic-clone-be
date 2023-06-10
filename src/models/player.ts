import { Schema, model, InferSchemaType } from 'mongoose';


const playerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  country: { type: String, required: true },
  photoUrl: { type: String },
  number: { type: Number },
  position: { type: String, required: true },
  club: { type: Schema.Types.ObjectId, ref: 'Club' },
}, {
  timestamps: true
});

export type PlayerType = InferSchemaType<typeof playerSchema>;

export default model<PlayerType>('Player', playerSchema);