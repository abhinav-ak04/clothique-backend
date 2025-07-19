import Wishlist from '../models/Wishlist.js';
import { StatusCodes } from '../utils/status-codes.js';

export const getWishlistItems = async (req, res) => {
  const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(BAD_REQUEST).json({
        message:
          'User ID is required. Please provide a valid user ID in the request paramatres.',
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      'items.product'
    );

    if (!wishlist) {
      return res
        .status(OK)
        .json({ message: 'Wishlist is empty', items: [], nbHits: 0 });
    }

    return res.status(OK).json({
      message: 'Wishlist items retrieved successfully',
      items: wishlist.items,
      nbHits: wishlist.items.length,
    });
  } catch (error) {
    console.error('Error retrieving wishlist items:', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  const { OK, CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(BAD_REQUEST).json({
        message:
          'userId or productId is missing. Please provide both userId and productId in the request body.',
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: [{ product: productId, addedAt: Date.now() }],
      });
    } else {
      const existingItem = wishlist.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        await wishlist.populate('items.product');
        return res.status(OK).json({
          message: 'Item already exists in the wishlist',
          wishlist,
          nbHits: wishlist.items.length,
        });
      }

      wishlist.items.push({ product: productId, addedAt: Date.now() });
    }

    wishlist.updatedAt = Date.now();

    await wishlist.save();
    await wishlist.populate('items.product');

    return res.status(CREATED).json({
      message: 'Item added to wishlist successfully',
      wishlist,
      nbHits: wishlist.items.length,
    });
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(BAD_REQUEST).json({
        message:
          'userId or productId is missing. Please provide both userId and productId in the request body.',
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Wishlist not found for the user' });
    }

    const isItemMatches = (item) => item.product.toString() === productId;

    const existingItem = wishlist.items.find((item) => isItemMatches(item));

    if (!existingItem) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Item not found in wishlist' });
    }

    wishlist.items = wishlist.items.filter((item) => !isItemMatches(item));

    wishlist.updatedAt = Date.now();
    await wishlist.save();
    await wishlist.populate('items.product');

    return res
      .status(OK)
      .json({ message: 'Item removed from wishlist successfully', wishlist });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const isInWishlist = async (req, res) => {
  const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { userId, productId } = req.query;
    console.log(req.user);

    if (!userId || !productId) {
      return res.status(BAD_REQUEST).json({
        message:
          'userId or productId is missing. Please provide both userId and productId in the query parameters.',
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res
        .status(OK)
        .json({ message: 'Wishlist not found for the user', exists: false });
    }

    const exists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    return res
      .status(OK)
      .json({ message: 'Wishlist exists for the user', exists });
  } catch (error) {
    console.error('Error checking wishlist existence:', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};
