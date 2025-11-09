import express from "express";
import {
  getOrders,
  getPendingOrders,
  getOrderHistory,
  addOrder,
  confirmOrder,
  cancelOrder,
  markOrderAsSeen,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// GET routes
router.get("/", getOrders); // Get all orders
router.get("/pending", getPendingOrders); // Get pending orders only
router.get("/history", getOrderHistory); // Get confirmed/cancelled orders

// POST routes
router.post("/", addOrder); // Create new order (from customer)

// PATCH routes
router.patch("/:id/confirm", confirmOrder); // Confirm order (admin)
router.patch("/:id/cancel", cancelOrder); // Cancel order (admin)
router.patch("/:id/seen", markOrderAsSeen); // Mark as seen
router.patch("/:id/status", updateOrderStatus); // Legacy status update

// DELETE routes
router.delete("/:id", deleteOrder); // Delete order

export default router;