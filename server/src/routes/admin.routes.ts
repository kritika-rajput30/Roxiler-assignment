import express from 'express';
import {
  getDashboardStats,
  addUser,
  getUsers,
  getUserDetails,
  getStores,
} from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

router.use(authenticate, authorize(['admin']));

router.get('/dashboard', getDashboardStats);
router.post('/users', addUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.get('/stores', getStores);

export default router;
