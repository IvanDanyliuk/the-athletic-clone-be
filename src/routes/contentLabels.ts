import express from 'express';
import * as ContentLabelsController from '../controllers/contentLabels';


const router = express.Router();

router.post('/', ContentLabelsController.createContentLabel);

export default router;