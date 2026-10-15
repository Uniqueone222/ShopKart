import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import razorpay from "../middleware/razorpay.js";

const isValidShippingAddress = (shippingAddress) => {
  if (!shippingAddress || typeof shippingAddress !== "object") {
    return "Shipping address is required.";
  }

  const requiredFields = [
    "fullName",
    "phone",
    "addressLine1",
    "city",
    "state",
    "pincode",
  ];

  for (const field of requiredFields) {
    const value = shippingAddress[field];
    if (typeof value !== "string" || value.trim() === "") {
      return `${field} is required.`;
    }
  }

  if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
    return "Phone number must contain 10 digits.";
  }

  if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
    return "Pincode must contain 6 digits.";
  }

  return null;
};

const getRazorpayErrorDetails = (error) => {
  const gatewayError =
    error && typeof error === "object" ? error.error : undefined;

  if (!gatewayError || typeof gatewayError !== "object") {
    return {
      statusCode: error?.statusCode,
      message:
        error?.message ||
        (typeof gatewayError === "string" ? gatewayError : undefined) ||
        "Unknown Razorpay API error",
    };
  }

  return {
    statusCode: error.statusCode,
    code: gatewayError.code,
    description: gatewayError.description,
    source: gatewayError.source,
    step: gatewayError.step,
    reason: gatewayError.reason,
    message:
      gatewayError.description ||
      gatewayError.reason ||
      gatewayError.code ||
      error.message ||
      "Unknown Razorpay API error",
  };
};

export const createPaymentOrder = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay credentials are not configured on the backend.",
      });
    }

    const { shippingAddress } = req.body;
    const validationError = isValidShippingAddress(shippingAddress);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const customer = req.user;

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    const productIds = customer.cart.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    for (const item of customer.cart) {
      const product = productMap.get(item.product.toString());

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "One or more products are no longer available.",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        });
      }
    }

    const orderItems = customer.cart.map((item) => {
      const product = productMap.get(item.product.toString());

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const pendingOrder = await Order.create({
      user: customer._id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      totalAmount,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT",
    });

    const amountInPaise = Math.round(totalAmount * 100);

    let razorpayOrder;

    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: pendingOrder._id.toString(),
      });

      pendingOrder.razorpayOrderId = razorpayOrder.id;
      await pendingOrder.save();
    } catch (error) {
      const razorpayError = getRazorpayErrorDetails(error);

      try {
        await Order.deleteOne({ _id: pendingOrder._id });
      } catch (cleanupError) {
        console.error(
          "Failed to remove pending ShopKart order after payment-order creation failed:",
          cleanupError.message
        );
      }

      if (!razorpayOrder) {
        console.error("Razorpay payment-order creation failed:", razorpayError);
        return res.status(502).json({
          success: false,
          message: razorpayError.message,
        });
      }

      console.error("Failed to save Razorpay order reference:", error.message);
      return res.status(500).json({
        success: false,
        message:
          "Razorpay created the payment order, but ShopKart could not save it. Please retry.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment order created successfully.",
      shopKartOrderId: pendingOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!shopKartOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(shopKartOrderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret is not configured on the backend.",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    req.user.cart = [];
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
