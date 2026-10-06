import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

const populateCartProducts = (customer) =>
  customer.populate({
    path: "cart.product",
    select: "name price category image stock",
  });

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const cartItem = req.user.cart.find(
      (item) => item.product.toString() === productId,
    );

    if ((cartItem?.quantity ?? 0) + 1 > product.stock) {
      return res.status(400).json({
        message: "Stock not available",
      });
    }

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      req.user.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    await req.user.save();
    await populateCartProducts(req.user);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: req.user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price category image stock",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: customer.cart.length,
      cart: customer.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const cartItem = req.user.cart.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }
    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Stock not available",
      });
    }

    cartItem.quantity = quantity;
    await req.user.save();
    await populateCartProducts(req.user);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: req.user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(401).json({
        message: "Not Logged In",
      });
    }

    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }

    customer.cart.splice(customer.cart.indexOf(cartItem), 1);
    await customer.save();
    await populateCartProducts(customer);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: customer.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
