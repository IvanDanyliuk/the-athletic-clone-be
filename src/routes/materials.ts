import express from 'express';
import * as MaterialsController from '../controllers/materials';


const router = express.Router();

router.get('/', MaterialsController.getMaterials);
router.get('/:id', MaterialsController.getMaterial);
router.post('/', MaterialsController.createMaterial);

export default router;