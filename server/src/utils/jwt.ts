import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (payload: { user_id: string, role: string }) => {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '1h' });
};


export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
