import express from 'express';
import * as UserController from '../controllers/users';


const router = express.Router();

router.get('/', UserController.getAuthenticatedUser);
router.get('/by-role', UserController.getUsersByRole);
router.get('/all', UserController.getAllUsers);
router.post('/signup', UserController.signUp);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.patch('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;