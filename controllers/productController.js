import Product from '../models/Product.js';

export const searchProducts = async (req, res) => {
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
    res.json({ products, nbHits: products.length });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId: +productId });

    if (!product) res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ product });
  } catch (error) {
    console.error('❌ Error fetching product by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
