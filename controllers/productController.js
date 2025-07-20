import Product from '../models/Product.js';
import { StatusCodes } from '../utils/status-codes.js';

export const searchProducts = async (req, res) => {
  const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { q, type, brand, color, categories, discount, sortBy } = req.query;

    const query = {};

    if (q) {
      const words = q.trim().split(/\s+/);

      // Try text index if search is long enough
      if (words.length > 1 || q.length > 2) {
        query.$text = { $search: q };
      } else {
        // Fallback regex search for partial match
        const regex = new RegExp(q, 'i');
        query.$or = [
          { brand: regex },
          { desc: regex },
          { individualCategory: regex },
          { mainCategory: regex },
          { subCategory: regex },
          { gender: regex },
          { details: regex },
          { materialAndCare: regex },
          { sizeAndFit: regex },
          { color: regex },
          { 'specs.prop': regex },
          { 'specs.value': regex },
        ];
      }
    }

    if (type) query.gender = type;

    if (brand) query.brand = { $in: Array.isArray(brand) ? brand : [brand] };

    if (color) query.color = { $in: Array.isArray(color) ? color : [color] };

    if (categories)
      query.individualCategory = {
        $in: Array.isArray(categories) ? categories : [categories],
      };

    if (discount) {
      const percent = parseInt(discount);
      if (!isNaN(percent)) {
        query.$expr = {
          $gte: [
            {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: ['$originalPrice', '$discountPrice'],
                    },
                    '$originalPrice',
                  ],
                },
                100,
              ],
            },
            percent,
          ],
        };
      }
    }

    let sortQuery = {};
    switch (sortBy) {
      case 'new':
        sortQuery = { createdAt: -1 };
        break;

      case 'discount':
        ``;
        sortQuery = {
          $expr: {
            $subtract: ['$originalPrice', '$discountPrice'],
          },
        };
        break;

      case 'price_asc':
        sortQuery = { discountPrice: 1 };
        break;

      case 'price_desc':
        sortQuery = { discountPrice: -1 };
        break;

      // case 'rating':
      //   sortQuery = { averageRating: -1 };
      //   break;

      default:
        sortQuery = { popularityScore: -1 };
    }

    const products = await Product.find(query).sort(sortQuery);
    res.status(OK).json({ products, nbHits: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId: +productId });

    if (!product)
      return res.status(NOT_FOUND).json({ message: 'Product not found' });

    res.status(OK).json({ product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};
