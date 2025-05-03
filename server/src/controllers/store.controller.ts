import { Request, Response } from 'express';
import prisma from '../prisma/client';

// Create a new store
export const createStore = async (req: Request, res: Response) => {
  const { name, address, email, userId, image } = req.body;

  try {
    const store = await prisma.store.create({
      data: {
        name,
        address,
        email,
        image,
        owner: {
          connect: { user_id: userId },
        },
      },
    });
    return res.status(201).json(store);
  } catch (error) {
    console.error("Create Store Error:", error);
    return res.status(500).json({ error: 'Failed to create store' });
  }
};



// Get all stores with optional filters
export const getAllStores = async (req: Request, res: Response) => {
  const { name, email, address } = req.query;

  try {
    const stores = await prisma.store.findMany({
      where: {
        name: name ? { contains: name as string, mode: 'insensitive' } : undefined,
        email: email ? { contains: email as string, mode: 'insensitive' } : undefined,
        address: address ? { contains: address as string, mode: 'insensitive' } : undefined,
      },
      include: {
        ratings: true,
      },
    });

    const storesWithRating = stores.map((store) => {
      const total = store.ratings.length;
      const avgRating =
        total > 0
          ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / total
          : null;

      return {
        ...store,
        averageRating: avgRating,
        totalRatings: total,
      };
    });

    res.json(storesWithRating);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

// Get store by ID
export const getStoreById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const store = await prisma.store.findUnique({
      where: { storeId: id },
      include: {
        ratings: true,
        user: true,
      },
    });

    if (!store) return res.status(404).json({ error: 'Store not found' });

    const avgRating =
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) /
          store.ratings.length
        : null;

    res.json({
      ...store,
      averageRating: avgRating,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch store' });
  }
};

// Update store (Only by owner or admin)
export const updateStore = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, email } = req.body;
  const user = req.user; // from auth middleware

  try {
    const store = await prisma.store.findUnique({ where: { storeId: id } });

    if (!store) return res.status(404).json({ error: 'Store not found' });

    if (user.role !== 'admin' && user.userId !== store.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.store.update({
      where: { storeId: id },
      data: { name, address, email },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update store' });
  }
};

// Delete store (Only by owner or admin)
export const deleteStore = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const store = await prisma.store.findUnique({ where: { storeId: id } });

    if (!store) return res.status(404).json({ error: 'Store not found' });

    if (user.role !== 'admin' && user.userId !== store.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.store.delete({ where: { storeId: id } });
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete store' });
  }
};
export const getStoresByOwner = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Optional: verify authenticated user matches userId (authorization)
    if (req.user?.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only view your own stores' });
    }

    const stores = await prisma.store.findMany({
      where: {
        user_id: userId,
      },
    });

    return res.status(200).json(stores);
  } catch (error) {
    console.error('Get Stores by Owner Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve stores' });
  }
};