import { Request, Response } from 'express';
import prisma from '../prisma/client';

// GET /api/users - Admin only - List all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { name, email, address, role } = req.query;

    const users = await prisma.user.findMany({
      where: {
        name: name ? { contains: String(name), mode: 'insensitive' } : undefined,
        email: email ? { contains: String(email), mode: 'insensitive' } : undefined,
        address: address ? { contains: String(address), mode: 'insensitive' } : undefined,
        role: role ? String(role) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        ratings: true, // optional
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// PUT /api/users/password - Update password (logged-in user)
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).json({ error: 'New password is required' });

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword, // 🔒 You should hash this in production
      },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

// GET /api/users/:id - Admin only - Get user details (including rating if store owner)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        store: true,
        ratings: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
