import Cart from '../models/Cart.js';
import { StatusCodes } from '../utils/status-codes.js';

export const getCartItems = async (req, res) => {
  const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(BAD_REQUEST).json({ message: 'User ID is required' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res
        .status(OK)
        .json({ message: 'Cart is empty', items: [], nbHits: 0 });
    }

    return res.status(OK).json({
      message: 'Cart items retrieved successfully',
      items: cart.items,
      nbHits: cart.items.length,
    });
  } catch (error) {
    console.error('Error retrieving cart items:', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;
    const { productId, quantity, size } = req.body;

    if (!productId || !quantity || !size) {
      return res.status(BAD_REQUEST).json({
        message:
          'productId, quantity or size is missing. Please provide all required fields in the request body.',
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, size }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId && item.size === size
      );

      if (existingItem) existingItem.quantity += quantity;
      else cart.items.push({ product: productId, quantity, size });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product');

    return res
      .status(CREATED)
      .json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding item to the cart:', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(BAD_REQUEST).json({
        message:
          'productId or size is missing. Please provide all required fields in the request body.',
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart)
      return res
        .status(NOT_FOUND)
        .json({ message: 'Cart not found for the user.' });

    const isItemMatches = (item) =>
      item.product.toString() === productId && item.size === size;

    const item = cart.items.find((item) => isItemMatches(item));

    if (!item)
      return res.status(NOT_FOUND).json({ message: 'Item not found in cart' });

    cart.items = cart.items.filter((item) => !isItemMatches(item));

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product');

    return res.status(OK).json({
      message: 'Item removed from cart successfully',
      cart,
      nbHits: cart.items.length,
    });
  } catch (error) {
    console.error('Error removing item from the cart:', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Cart not found for the user' });
    }

    cart.items = [];

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(OK).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('Error clearing the cart:', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const userId = req.userId;
    const { productId, currentSize, newSize, newQuantity } = req.body;

    if (!productId || !currentSize) {
      return res.status(BAD_REQUEST).json({
        message:
          'productId or currentSize is missing. Please provide all required fields in the request body.',
      });
    }

    if (!newSize && !newQuantity)
      return res.status(BAD_REQUEST).json({
        message:
          'newSize or newQuantity is missing. Please provide at least one of them.',
      });

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Cart not found for the user' });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId && item.size === currentSize
    );

    if (!item) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Item not found in the cart' });
    }

    if (newSize) item.size = newSize;
    if (newQuantity) item.quantity = newQuantity;

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product');

    res.status(OK).json({ message: 'Cart item updated successfully', cart });
  } catch (error) {
    console.error('Error updating the cart item:', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};
