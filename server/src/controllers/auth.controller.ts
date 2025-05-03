import { Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import prisma from '../prisma/client';

export const register = async (req: Request, res: Response) => {
  const { name, email, address, password } = req.body;

  // Ensure all fields are provided
  if (!name || !email || !address || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the email is already registered
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  // Hash the password before saving it
  const hashed = await hashPassword(password);

  // Create the new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      address,
      password: hashed,
      role: 'user', // default role
    },
  });

  // Generate JWT token
  const token = generateToken({ user_id: user.user_id, role: user.role });

  // Return the token and user details (including role)
  res.status(201).json({
    token,
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if the user exists by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'Invalid email or password' });

  // Compare password with stored hash
  const isValid = await comparePassword(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid email or password' });

  // Generate JWT token
  const token = generateToken({ user_id: user.user_id, role: user.role });

  // Return the token and user details (including role)
  res.status(200).json({
    token,
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
