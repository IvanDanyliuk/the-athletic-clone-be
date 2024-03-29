import { Schema, model, InferSchemaType } from 'mongoose';


const scheduleSchema = new Schema({
  competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
  season: { type: String, required: true },
  fixture: [{
    id: { type: String, required: true },
    matchweekName: { type: String, required: true },
    basicDate: { type: String, required: true },
    games: [
      {
        id: { type: String }, 
        home: { 
          club: { type: Schema.Types.ObjectId, ref: 'Club' },
          points: { type: Number },
          goalsFor: { type: Number },
          goalsAgainst: { type: Number },
          final: { type: String },
          
        },
        away: { 
          club: { type: Schema.Types.ObjectId, ref: 'Club' },
          points: { type: Number },
          goalsFor: { type: Number },
          goalsAgainst: { type: Number },
          final: { type: String },
          
        },
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