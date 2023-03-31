import express from 'express';
import * as ScheduleController from '../controllers/schedules';


const router = express.Router();

router.get('/', ScheduleController.getSchedules);
router.get('/:id', ScheduleController.getSchedule);
router.post('/', ScheduleController.createSchedule);
router.patch('/', ScheduleController.updateSchedule);
router.delete('/', ScheduleController.deleteSchedule);

export default router;