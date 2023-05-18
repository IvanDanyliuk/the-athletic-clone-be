import express from 'express';
import * as MaterialsController from '../controllers/materials';


const router = express.Router();

router.get('/', MaterialsController.getMaterials);
router.get('/articles', MaterialsController.getMaterials);
router.get('/notes', MaterialsController.getMaterials);
router.get('/real-time-posts', MaterialsController.getMaterials);
router.get('/recent', MaterialsController.getRecentMaterials);
router.get('/homepage', MaterialsController.getHomepageSecondaryMaterials);
router.get('/:id', MaterialsController.getMaterial);
router.post('/', MaterialsController.createMaterial);
router.patch('/', MaterialsController.updateMaterial);
router.patch('/like', MaterialsController.likeMaterial);
router.delete('/', MaterialsController.deleteMaterial);

export default router;