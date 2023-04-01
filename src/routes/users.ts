import express from 'express';
import * as UserController from '../controllers/users';


const router = express.Router();

router.get('/', UserController.getAuthenticatedUser);
router.get('/by-role', UserController.getUsersByRole);
router.get('/all', UserController.getAllUsers);
router.get('/locations', UserController.getUsersLocations);
router.post('/signup', UserController.signUp);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/new-user', UserController.createUser);
router.patch('/', UserController.updateUser);
router.delete('/', UserController.deleteUser);

export default router;