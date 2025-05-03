import express from 'express';
import {
  addRating,
  getAllRatings,
  getStoreRatingStats,
  updateRating,
} from '../controllers/rating.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticate, addRating);
router.put('/:id',authenticate, updateRating); // Update rating
router.get('/', authenticate, getAllRatings);
router.get('/stats/:storeId', authenticate, getStoreRatingStats);

export default router;
