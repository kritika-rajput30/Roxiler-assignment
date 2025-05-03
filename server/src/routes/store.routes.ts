import express from 'express';
import {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
  getStoresByOwner,
} from '../controllers/store.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

router.post('/', authenticate, authorize(['admin', 'owner']), createStore);
router.get('/', authenticate, getAllStores);
router.get('/:id', authenticate, getStoreById);
router.put('/:id', authenticate,authorize(['admin', 'owner']), updateStore);
router.delete('/:id', authenticate,authorize(['admin', 'owner']), deleteStore);
router.get('/owner/:userId', authenticate,authorize(['admin', 'owner']), getStoresByOwner);

export default router;
