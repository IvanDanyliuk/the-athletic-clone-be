import express from 'express';
import * as PlayersController from '../controllers/players';


const router = express.Router();

router.get('/all', PlayersController.getAllPlayers);
router.get('/:id', PlayersController.getPlayer);
router.post('/', PlayersController.createPlayer);
router.patch('/:id', PlayersController.updatePlayer);
router.delete('/', PlayersController.deletePlayer);

export default router;