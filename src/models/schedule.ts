import { Schema, model, InferSchemaType } from 'mongoose';


const scheduleSchema = new Schema({
  competition: { type: Schema.Types.Mixed, ref: 'Competition' },
  tournament: {
    groupStage: [
      {
        groupIndex: { type: String, required: true },
        teams: [{ type: Schema.Types.Mixed, ref: 'Club' }],
        games: [{
          home: { type: Schema.Types.Mixed, ref: 'Club' },
          away: { type: Schema.Types.Mixed, ref: 'Club' },
          date: { type: Date, required: true },
          location: { type: String, required: true },
          score: { type: String }
        }]
      }
    ],
    knockoutStage: [
      {
        stageName: { type: String, required: true },
        teams: [{ type: Schema.Types.Mixed, ref: 'Club' }],
        games: [{
          home: { type: Schema.Types.Mixed, ref: 'Club' },
          away: { type: Schema.Types.Mixed, ref: 'Club' },
          date: { type: Date, required: true },
          location: { type: String, required: true },
          score: { type: String }
        }]
      }
    ]
  } || null,
  league: [
    {
      matchweekName: { type: String, required: true },
      home: { type: Schema.Types.Mixed, ref: 'Club' },
      away: { type: Schema.Types.Mixed, ref: 'Club' },
      date: { type: Date, required: true },
      location: { type: String, required: true },
      score: { type: String }
    }
  ] || null
}, {
  timestamps: true
});

type ScheduleType = InferSchemaType<typeof scheduleSchema>;

export default model<ScheduleType>('Schedule');