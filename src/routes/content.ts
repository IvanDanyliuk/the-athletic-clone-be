import express from 'express';
import * as ContentSectionsController from '../controllers/content';


const router = express.Router();

router.get('/', ContentSectionsController.getContentSections);
router.post('/', ContentSectionsController.createContentSection);
router.patch('/', ContentSectionsController.updateContentSection);
router.delete('/', ContentSectionsController.deleteContentSection);

export default router;