import User from '../models/User.js';
import { StatusCodes } from '../utils/status-codes.js';

export const getUserData = async (req, res) => {
  const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
  } catch (error) {
    console.error('Error retrieving user data', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const updateUserData = async (req, res) => {
  const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
  } catch (error) {
    console.error('Error updating user data', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};
