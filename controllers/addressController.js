import Address from '../models/Address.js';
import { StatusCodes } from '../utils/status-codes.js';

export const getAllAddresses = async (req, res) => {
  const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;

    const addresses = await Address.find({ user: userId });

    if (addresses.length === 0) {
      return res.status(OK).json({
        message: 'No address found for the user',
        addresses,
        nbHits: 0,
      });
    }

    return res.status(OK).json({
      message: 'Addresses retrieved successfully',
      addresses,
      nbHits: addresses.length,
    });
  } catch (error) {
    console.error('Error occured while fetching the addresses', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const getAddressById = async (req, res) => {
  const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { addressId } = req.params;

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(NOT_FOUND).json({ message: 'No address found' });
    }

    return res.status(OK).json({
      message: 'Address retrieved successfully',
      address,
    });
  } catch (error) {
    console.error('Error occured while fetching the address', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const addAddress = async (req, res) => {
  const { CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;
    const {
      name,
      mobileNo,
      pincode,
      addressLine,
      locality,
      city,
      state,
      addressType,
      isDefault,
    } = req.body;

    if (
      !userId ||
      !name ||
      !mobileNo ||
      !pincode ||
      !addressLine ||
      !locality ||
      !city ||
      !state ||
      !addressType
    ) {
      return res.status(BAD_REQUEST).json({
        message: 'Please provide all necessary fields in the request body',
      });
    }

    const existingAddresses = await Address.find({ user: userId });

    const isFirstAddress = existingAddresses && existingAddresses.length === 0;

    if (!isFirstAddress && isDefault) {
      await Address.updateMany(
        {
          user: userId,
          isDefault: true,
        },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = new Address({
      user: userId,
      name,
      mobileNo,
      pincode,
      addressLine,
      locality,
      city,
      state,
      addressType,
      isDefault: isDefault || isFirstAddress,
    });

    await newAddress.save();

    return res
      .status(CREATED)
      .json({ message: 'Address added successfully', address: newAddress });
  } catch (error) {
    console.error('Error occured while adding the address', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(BAD_REQUEST).json({
        message:
          'User ID is required. Please pass a valid user ID in request body',
      });
    }

    const { addressId } = req.params;

    await Address.updateMany(
      { user: userId, isDefault: true },
      { $set: { isDefault: false } }
    );

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(NOT_FOUND).json({ message: 'Address not found' });
    }

    if (address.user.toString() !== userId) {
      return res.status(BAD_REQUEST).json({
        message: 'Address does not belong to the provided user',
      });
    }

    address.isDefault = true;

    await address.save();

    return res
      .status(OK)
      .json({ message: 'Address set as default successfully', address });
  } catch (error) {
    console.error('Error occured while setting default address', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const updateAddressDetails = async (req, res) => {
  const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const {
      name,
      mobileNo,
      pincode,
      addressLine,
      locality,
      city,
      state,
      addressType,
    } = req.body;

    const { addressId } = req.params;

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(NOT_FOUND).json({ message: 'Address not found' });
    }

    if (name) address.name = name;
    if (mobileNo) address.mobileNo = mobileNo;
    if (pincode) address.pincode = pincode;
    if (addressLine) address.addressLine = addressLine;
    if (locality) address.locality = locality;
    if (city) address.city = city;
    if (state) address.state = state;
    if (addressType) address.addressType = addressType;

    await address.save();

    return res
      .status(OK)
      .json({ message: 'Address details updated successfully', address });
  } catch (error) {
    console.error('Error occured while updating the address', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const removeAddress = async (req, res) => {
  const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { addressId } = req.params;

    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(NOT_FOUND).json({ message: 'Address not found' });
    }

    return res
      .status(OK)
      .json({ message: 'Address removed successfully', deletedAddress });
  } catch (error) {
    console.error('Error occured while removing the addresses', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};
