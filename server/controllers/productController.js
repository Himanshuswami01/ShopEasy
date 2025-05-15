import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';

export const productController = {
    // Get all products with filtering
    getAllProducts: catchAsync(async (req, res) => {
        const { 
            category, 
            subcategory, 
            minPrice, 
            maxPrice, 
            color, 
            size,
            sort,
            page = 1,
            limit = 12
        } = req.query;

        const query = {};
        
        if (category) query.category = category;
        if (subcategory) query.subcategory = subcategory;
        if (color) query.colors = color;
        if (size) query.sizes = size;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        const sortOptions = {
            'price-asc': { price: 1 },
            'price-desc': { price: -1 },
            'rating-desc': { rating: -1 },
            'newest': { createdAt: -1 }
        };

        const products = await Product.find(query)
            .sort(sortOptions[sort] || sortOptions['newest'])
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Product.countDocuments(query);

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    }),

    // Get featured products
    getFeaturedProducts: catchAsync(async (req, res) => {
        const products = await Product.find({ rating: { $gte: 4.5 } })
            .sort({ rating: -1 })
            .limit(8);
        res.json(products);
    }),

    // Get sale products
    getSaleProducts: catchAsync(async (req, res) => {
        const products = await Product.find({ salePrice: { $ne: null } })
            .sort({ 
                $expr: { 
                    $divide: [
                        { $subtract: ['$price', '$salePrice'] },
                        '$price'
                    ]
                }
            })
            .limit(8);
        res.json(products);
    })
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.page) || 1;
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { description: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.remove();
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = {
            user: req.user._id,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(5);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 