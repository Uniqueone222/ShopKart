import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        // Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check duplicate
        const alreadyWishlisted = req.user.wishlist.some(
            (id) => id.toString() === productId
        );

        if (alreadyWishlisted) {
            return res.status(409).json({
                message: "Product already in wishlist"
            });
        }

        // Add product to wishlist
        req.user.wishlist.push(productId);

        await req.user.save();

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: "wishlist",
            select: "name price category image stock"
        });

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        // Check if product exists in wishlist
        const wishlistIndex = req.user.wishlist.findIndex(
            (id) => id.toString() === productId
        );

        if (wishlistIndex === -1) {
            return res.status(404).json({
                message: "Product not in wishlist"
            });
        }

        // Remove product
        req.user.wishlist.splice(wishlistIndex, 1);

        await req.user.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};