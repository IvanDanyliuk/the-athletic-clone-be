import express from 'express';
import * as ScheduleController from '../controllers/schedules';


const router = express.Router();

router.get('/', ScheduleController.getSchedules);
router.get('/:id', ScheduleController.getSchedule);
router.post('/', ScheduleController.createSchedule);
router.patch('/:id', ScheduleController.updateSchedule);
router.delete('/:id', ScheduleController.deleteSchedule);

export default router;