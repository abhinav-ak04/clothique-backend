import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Auth from '../models/Auth.js';
import User from '../models/User.js';
import { StatusCodes } from '../utils/status-codes.js';

export const handleLogin = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR } =
    StatusCodes;

  try {
    const { mobileNo, password } = req.body;

    if (!mobileNo || !password) {
      console.log(mobileNo);
      return res.status(BAD_REQUEST).json({
        message:
          'mobileNo or password is missing. Please provide all required fields in the request body.',
        success: false,
      });
    }

    let user = await User.findOne({ mobileNo });

    if (!user) {
      return res.status(FORBIDDEN).json({
        message:
          'User does not exist with the mobile number. Please sign up or give correct existing mobile number',
        success: false,
      });
    }

    const auth = await Auth.findOne({ user: user._id });
    if (!auth) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Password entry not found in DB.', success: false });
    }

    const isPassEqual = await bcrypt.compare(password, auth.password);
    if (!isPassEqual) {
      return res
        .status(FORBIDDEN)
        .json({ message: 'Password is incorrect', success: false });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, mobileNo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res
      .status(OK)
      .json({ message: 'Login successful', success: true, jwtToken, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const handleSignup = async (req, res) => {
  const { CREATED, BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { mobileNo, password } = req.body;

    if (!mobileNo || !password) {
      return res.status(BAD_REQUEST).json({
        message:
          'mobileNo or password is missing. Please provide all required fields in the request body.',
        success: false,
      });
    }

    let user = await User.findOne({ mobileNo });

    if (user) {
      return res.status(CONFLICT).json({
        message: 'User already exists, you can login',
        success: false,
      });
    }

    user = new User({ mobileNo });
    await user.save();

    const auth = new Auth({ user: user._id, password });
    auth.password = await bcrypt.hash(password, 10);

    await auth.save();
    await auth.populate('user');

    res
      .status(CREATED)
      .json({ message: 'Signup successful', auth, success: true });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      error: error.message,
      success: false,
    });
  }
};

export const addAuthDoc = async (req, res) => {
  const { CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } =
    StatusCodes;

  try {
    const { userId, password } = req.body;

    if (!userId) {
      return res.status(BAD_REQUEST).json({
        message:
          'userId is missing. Please provide all required fields in the request body.',
        success: false,
      });
    }

    let user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({
        message: 'User not found',
        success: false,
      });
    }

    const auth = new Auth({ user: user._id, password });
    auth.password = await bcrypt.hash(password, 10);

    await auth.save();
    await auth.populate('user');

    res.status(CREATED).json({
      message: 'Auth Document added successfully',
      auth,
      success: true,
    });
  } catch (error) {
    console.error('Error adding auth doc:', error);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      error: error.message,
      success: false,
    });
  }
};
