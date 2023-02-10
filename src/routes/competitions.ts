import express from 'express';
import * as CompetitionsController from '../controllers/competitions';


const router = express.Router();

router.get('/', CompetitionsController.getCompetitions);
router.get('/:id', CompetitionsController.getCompetition);
router.post('/', CompetitionsController.createCompetition);
router.patch('/:id', CompetitionsController.updateCompetition);
router.delete('/:id', CompetitionsController.deleteCompetition);

export default router;