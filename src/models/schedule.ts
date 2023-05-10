import { Schema, model, InferSchemaType } from 'mongoose';


const scheduleSchema = new Schema({
  competition: { type: Schema.Types.Mixed, ref: 'Competition' },
  season: { type: String, required: true },
  fixture: [{
    id: { type: String, required: true },
    matchweekName: { type: String, required: true },
    basicDate: { type: String, required: true },
    games: [
      {
        id: { type: String }, 
        home: { type: Schema.Types.Mixed, ref: 'Club' },
        away: { type: Schema.Types.Mixed, ref: 'Club' },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        score: { type: String }
      }
    ]
  }]
}, {
  timestamps: true
});

export type ScheduleType = InferSchemaType<typeof scheduleSchema>;

export default model<ScheduleType>('Schedule', scheduleSchema);