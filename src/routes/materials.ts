import express from 'express';
import * as MaterialsController from '../controllers/materials';


const router = express.Router();

router.get('/', MaterialsController.getMaterials);
router.get('/articles', MaterialsController.getMaterials);
router.get('/notes', MaterialsController.getMaterials);
router.get('/real-time-posts', MaterialsController.getMaterials);
router.get('/recent', MaterialsController.getRecentMaterials);
router.get('/homepage', MaterialsController.getHomepageSecondaryMaterials);
router.get('/search-values', MaterialsController.getSearchValues);
router.get('/search', MaterialsController.searchMaterials);
router.get('/:id', MaterialsController.getMaterial);
router.post('/', MaterialsController.createMaterial);
router.patch('/', MaterialsController.updateMaterial);
router.delete('/', MaterialsController.deleteMaterial);

export default router;