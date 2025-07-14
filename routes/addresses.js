import express from 'express';

import {
  addAddress,
  getAddressById,
  getAllAddresses,
  removeAddress,
  setDefaultAddress,
  updateAddressDetails,
} from '../controllers/addressController.js';

const router = express.Router();

router.get('/', async (req, res) =>
  res.status(BAD_REQUEST).json({
    message:
      'User ID is required. Please provide a valid user ID in the request parametres',
  })
);

router.get('/user/:userId', getAllAddresses);
router.get('/:addressId', getAddressById);

router.post('/', addAddress);

router.patch('/:addressId', updateAddressDetails);
router.patch('/:addressId/set-default', setDefaultAddress);

router.delete('/:addressId', removeAddress);

export default router;
