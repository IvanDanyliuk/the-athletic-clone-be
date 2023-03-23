import express from 'express';
import * as ClubsController from '../controllers/clubs';


const router = express.Router();

router.get('/all', ClubsController.getAllClubs);
router.get('/country', ClubsController.getClubsByCountry);
router.get('/', ClubsController.getClub);
router.post('/', ClubsController.createClub);
router.patch('/', ClubsController.updateClub);
router.delete('/', ClubsController.deleteClub);

export default router;