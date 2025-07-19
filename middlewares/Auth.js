import jwt from 'jsonwebtoken';
import { StatusCodes } from '../utils/status-codes.js';

export const isAuthenticated = (req, res, next) => {
  const { FORBIDDEN } = StatusCodes;

  const auth = req.headers['authorization'];
  if (!auth) {
    return res.status(FORBIDDEN).json({
      message: 'Unauthorized access, JWT token is required',
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(FORBIDDEN)
      .json({ message: 'Unauthorized access, JWT token is wrong or expired' });
  }
};
