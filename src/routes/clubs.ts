import express from 'express';
import * as ClubsController from '../controllers/clubs';


const router = express.Router();

router.get('/', ClubsController.getClubs);
router.get('/:id', ClubsController.getClub);
router.post('/', ClubsController.createClub);
router.patch('/:id', ClubsController.updateClub);
router.delete('/:id', ClubsController.deleteClub);

export default router;