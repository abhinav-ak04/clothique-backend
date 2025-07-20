import jwt from 'jsonwebtoken';
import { StatusCodes } from '../utils/status-codes.js';

export const isAuthenticated = (req, res, next) => {
  const { FORBIDDEN } = StatusCodes;

  const auth = req.headers['authorization'];
  console.log(
    'Authorization header:',
    req.headers['authorization'],
    'for',
    req.method,
    req.originalUrl
  );

  if (!auth) {
    return res.status(FORBIDDEN).json({
      message: 'Unauthorized access, JWT token is required',
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res
      .status(FORBIDDEN)
      .json({ message: 'Unauthorized access, JWT token is wrong or expired' });
  }
};
