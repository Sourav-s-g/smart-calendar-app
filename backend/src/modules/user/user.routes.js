import express from 'express';
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById
} from './user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;