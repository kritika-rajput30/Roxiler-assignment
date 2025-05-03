import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { hashPassword } from '../utils/hash';

// Get Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
};

export const addUser = async (req: Request, res: Response) => {
    const { name, email, password, address, role } = req.body;
  
    try {
      const userExists = await prisma.user.findUnique({ where: { email } });
  
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const hashedPassword = await hashPassword(password);
  
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          address,
          password: hashedPassword,
          role,
        },
      });
  
      res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  };

// Get List of Users with Optional Filters
export const getUsers = async (req: Request, res: Response) => {
  const { name, email, address, role } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        name: { contains: name as string, mode: 'insensitive' },
        email: { contains: email as string, mode: 'insensitive' },
        address: { contains: address as string, mode: 'insensitive' },
        role: role ? (role as string) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Get User Details (with Rating if owner)
export const getUserDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Store: {
          include: {
            ratings: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const ratingAvg =
      user.role === 'owner' && user.Store
        ? user.Store.ratings.reduce((acc, r) => acc + r.rating, 0) /
          user.Store.ratings.length || 0
        : null;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      rating: ratingAvg,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user details' });
  }
};

// Get List of Stores with Optional Filters
export const getStores = async (req: Request, res: Response) => {
  const { name, email, address } = req.query;

  try {
    const stores = await prisma.store.findMany({
      where: {
        name: { contains: name as string, mode: 'insensitive' },
        email: { contains: email as string, mode: 'insensitive' },
        address: { contains: address as string, mode: 'insensitive' },
      },
      include: {
        ratings: true,
      },
    });

    const storeList = stores.map((store) => {
      const avgRating =
        store.ratings.reduce((acc, r) => acc + r.rating, 0) /
          store.ratings.length || 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: avgRating.toFixed(2),
      };
    });

    res.json(storeList);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stores' });
  }
};
