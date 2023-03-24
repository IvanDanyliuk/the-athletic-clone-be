import express from 'express';
import * as CompetitionsController from '../controllers/competitions';


const router = express.Router();

router.get('/all', CompetitionsController.getAllCompetitions);
router.get('/:id', CompetitionsController.getCompetition);
router.post('/', CompetitionsController.createCompetition);
router.patch('/:id', CompetitionsController.updateCompetition);
router.delete('/', CompetitionsController.deleteCompetition);

export default router;