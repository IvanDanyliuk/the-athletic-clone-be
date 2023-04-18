import express from 'express';
import * as ContentLabelsController from '../controllers/content';


const router = express.Router();

router.post('/', ContentLabelsController.createContentSection);

export default router;