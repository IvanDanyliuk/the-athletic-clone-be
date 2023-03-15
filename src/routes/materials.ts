import express from 'express';
import * as MaterialsController from '../controllers/materials';


const router = express.Router();

router.get('/all', MaterialsController.getAllMaterials);
router.get('/articles', MaterialsController.getAllMaterials);
router.get('/notes', MaterialsController.getAllMaterials);
router.get('/real-time-posts', MaterialsController.getAllMaterials);
router.get('/:id', MaterialsController.getMaterial);
router.post('/', MaterialsController.createMaterial);
router.patch('/', MaterialsController.updateMaterial);
router.delete('/', MaterialsController.deleteMaterial);

export default router;