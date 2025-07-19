import express from 'express';

import {
  addAddress,
  getAddressById,
  getAllAddresses,
  removeAddress,
  setDefaultAddress,
  updateAddressDetails,
} from '../controllers/addressController.js';
import { isAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/', async (req, res) =>
  res.status(BAD_REQUEST).json({
    message:
      'User ID is required. Please provide a valid user ID in the request parametres',
  })
);

router.get('/user/:userId', isAuthenticated, getAllAddresses);
router.get('/:addressId', isAuthenticated, getAddressById);

router.post('/add', isAuthenticated, addAddress);

router.patch('/update/:addressId', isAuthenticated, updateAddressDetails);
router.patch('/:addressId/set-default', isAuthenticated, setDefaultAddress);

router.delete('/remove/:addressId', isAuthenticated, removeAddress);

export default router;
