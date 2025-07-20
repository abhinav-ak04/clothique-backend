import User from '../models/User.js';
import { StatusCodes } from '../utils/status-codes.js';

export const getUserData = async (req, res) => {
  const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'User not found' });
    }

    return res
      .status(OK)
      .json({ message: 'User data retrieved successfully', user });
  } catch (error) {
    console.error('Error retrieving user data', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const isValidUser = async (req, res) => {
  const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { mobileNo } = req.query;

    if (!mobileNo) {
      return res.status(BAD_REQUEST).json({
        message:
          'mobileNo is missing. Please provide mobileNo in the req query parametres',
      });
    }

    const user = await User.findOne({ mobileNo });

    if (!user) {
      return res.status(OK).json({
        message: 'User not found for this mobile number',
        exists: false,
      });
    }

    return res.status(OK).json({
      message: 'User found for this mobile number',
      exists: true,
      user,
    });
  } catch (error) {
    console.error('Error verifying mobile number', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const updateUserData = async (req, res) => {
  const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;
    const { name, mobileNo, email, gender, dob, location, alternateMobileNo } =
      req.body;

    if (!userId) {
      return res.status(BAD_REQUEST).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'User not found with the given ID' });
    }

    if (name) user.name = name;
    if (mobileNo) user.mobileNo = mobileNo;
    if (email) user.email = email;
    if (gender) user.gender = gender;
    if (location) user.location = location;
    if (alternateMobileNo) user.alternateMobileNo = alternateMobileNo;

    if (dob) {
      const parsedDate = new Date(dob);
      if (isNaN(parsedDate)) {
        return res
          .status(BAD_REQUEST)
          .json({ message: 'Invalid date format for dob. Use yyyy-mm-dd' });
      }
      user.dob = parsedDate;
    }

    await user.save();

    return res.status(OK).json({
      message: 'User details updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user data', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};
