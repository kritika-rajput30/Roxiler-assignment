import { Request, Response } from 'express';
import prisma from '../prisma/client';

// Add a rating to a store
export const addRating = async (req: Request, res: Response) => {
  const { storeId, rating, comment, userId } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const store = await prisma.store.findUnique({ where: { store_id: storeId } });
    if (!store) return res.status(404).json({ error: "Store not found" });

    const newRating = await prisma.rating.create({
      data: {
        rating,
        comment,
        user_id: userId,
        store_id: storeId,
      },
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add rating" });
  }
};


// Get all ratings (with optional filters)
export const getAllRatings = async (req: Request, res: Response) => {
  const { storeId, userId } = req.query;

  try {
    const ratings = await prisma.rating.findMany({
      where: {
        store_id: storeId ? String(storeId) : undefined,
        user_id: userId ? String(userId) : undefined,
      },
      include: {
        user: true,
        store: true,
      },
    });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};


// Get average rating for a store
export const getStoreRatingStats = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  try {
    const ratings = await prisma.rating.findMany({
      where: { store_id: storeId },
    });

    if (ratings.length === 0) {
      return res.status(404).json({ message: 'No ratings for this store' });
    }

    const average =
      ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

    res.json({
      storeId,
      averageRating: average.toFixed(2),
      totalRatings: ratings.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rating stats' });
  }
};
// Update a rating by its ID
// Update a rating by its ID
export const updateRating = async (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  const { id } = req.params;

  // Validate the rating range (1 to 5)
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    // Find the existing rating by rating_id (which is a string)
    const existingRating = await prisma.rating.findUnique({ where: { rating_id: id } });

    if (!existingRating) {
      return res.status(404).json({ error: "Rating not found" });
    }

    // Update the rating and comment
    const updatedRating = await prisma.rating.update({
      where: { rating_id: id },  // Use rating_id as the key
      data: {
        rating,
        comment,
      },
    });

    res.json(updatedRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update rating" });
  }
};
