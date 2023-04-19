import express from 'express';
import * as ContentLabelsController from '../controllers/content';


const router = express.Router();

router.get('/', ContentLabelsController.getContentSections);
router.post('/', ContentLabelsController.createContentSection);
router.patch('/', ContentLabelsController.updateContentSection);

export default router;