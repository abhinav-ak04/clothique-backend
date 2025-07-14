import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { StatusCodes } from '../utils/status-codes.js';

export const getAllOrders = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(BAD_REQUEST).json({
        message:
          'User ID is required. Please provide a valid user ID in the request parametres.',
      });
    }

    const orders = await Order.find({ user: userId }).populate(
      'products.product'
    );

    if (!orders || orders.length === 0) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'No orders found for the user' });
    }

    return res.status(OK).json({
      message: 'Orders fetched successfully',
      orders,
      nbHits: orders.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const placeOrder = async (req, res) => {
  const { CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } =
    StatusCodes;

  try {
    const { userId, products, totalAmount, deliveryAddress } = req.body;

    if (!userId || !products || !totalAmount || !deliveryAddress) {
      return res.status(BAD_REQUEST).json({
        message:
          'userId, products array, totalAmount or deliveryAddress is missing. Please provide all the necessary fields in the request body.',
      });
    }

    if (products.length === 0) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'products array can not be empty' });
    }

    let expectedDeliveryDuration = 0;

    const transformedProducts = await Promise.all(
      products.map(async ({ product: productId, quantity, size }) => {
        try {
          const productObj = await Product.findById(productId);

          if (!productObj) {
            throw new Error(`Product with productId: ${productId} not found`);
          }

          expectedDeliveryDuration = Math.max(
            expectedDeliveryDuration,
            productObj.deliveryDuration
          );

          return {
            product: productId,
            quantity,
            size,
            priceAtPurchase: productObj.discountPrice,
          };
        } catch (error) {
          console.error('Error occured while fetching product details', error);
          if (error.message.startsWith('Product with productId')) {
            return res.status(NOT_FOUND).json({ message: error.message });
          }
          return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error', error: error.message });
        }
      })
    );

    // const expectedDeliveryDuration = fetchedProducts.reduce(
    //   (max, item) => Math.max(max, item.product.deliveryDuration),
    //   0
    // );

    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(
      expectedDeliveryDate.getDate() + expectedDeliveryDuration
    );

    const newOrder = new Order({
      user: userId,
      products: transformedProducts,
      totalAmount,
      deliveryAddress,
      placedAt: Date.now(),
      expectedDeliveryDate,
    });

    await newOrder.save();
    await newOrder.populate('products.product');

    return res
      .status(CREATED)
      .json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error occured while adding the order', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};
