import { Schema, model, InferSchemaType } from 'mongoose';


const scheduleSchema = new Schema({

}, {
  timestamps: true
});

type ScheduleType = InferSchemaType<typeof scheduleSchema>;

export default model<ScheduleType>('Schedule');