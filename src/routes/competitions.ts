import express from 'express';
import * as CompetitionsController from '../controllers/competitions';


const router = express.Router();

router.get('/all', CompetitionsController.getAllCompetitions);
router.get('/', CompetitionsController.getCompetitions);
router.get('/:id', CompetitionsController.getCompetition);
router.post('/', CompetitionsController.createCompetition);
router.patch('/', CompetitionsController.updateCompetition);
router.delete('/', CompetitionsController.deleteCompetition);

export default router;