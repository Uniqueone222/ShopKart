import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  createPaymentOrder,
  getMyOrders,
  getOrderById,
  verifyPayment,
} from "../controllers/order.controller.js";

const orderRoutes = express.Router();

orderRoutes.post("/create-payment-order", isAuthenticated, createPaymentOrder);
orderRoutes.post("/verify-payment", isAuthenticated, verifyPayment);
orderRoutes.get("/", isAuthenticated, getMyOrders);
orderRoutes.get("/:id", isAuthenticated, getOrderById);

export default orderRoutes;
