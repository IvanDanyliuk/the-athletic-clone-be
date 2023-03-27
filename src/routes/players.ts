import express from 'express';
import * as PlayersController from '../controllers/players';


const router = express.Router();

router.get('/', PlayersController.getPlayers);
router.get('/:id', PlayersController.getPlayer);
router.post('/', PlayersController.createPlayer);
router.patch('/', PlayersController.updatePlayer);
router.delete('/', PlayersController.deletePlayer);

export default router;