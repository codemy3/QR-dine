import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Table from "../models/Table.js";
import MenuItem from "../models/MenuItem.js";

// GET all orders
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// GET pending orders only
export const getPendingOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: "pending" })
    .sort({ createdAt: -1 });
  res.json(orders);
});

// GET order history
export const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 
    status: { $in: ["confirmed", "cancelled"] } 
  }).sort({ updatedAt: -1 });
  res.json(orders);
});

// ADD new order
export const addOrder = asyncHandler(async (req, res) => {
  const { tableId, items, totalAmount } = req.body;

  if (!tableId || !items || items.length === 0 || !totalAmount) {
    res.status(400);
    throw new Error("tableId, items, and totalAmount are required");
  }

  if (!mongoose.Types.ObjectId.isValid(tableId)) {
    res.status(400);
    throw new Error("Invalid tableId");
  }

  const table = await Table.findById(tableId);
  if (!table) {
    res.status(404);
    throw new Error("Table not found");
  }

  const enrichedItems = [];
  for (let item of items) {
    if (!item.itemId || !mongoose.Types.ObjectId.isValid(item.itemId)) {
      res.status(400);
      throw new Error(`Invalid itemId: ${item.itemId}`);
    }

    const menuItem = await MenuItem.findById(item.itemId);
    if (!menuItem) {
      res.status(404);
      throw new Error(`Menu item not found: ${item.itemId}`);
    }

    enrichedItems.push({
      itemId: item.itemId,
      name: menuItem.name,
      quantity: item.quantity,
      price: menuItem.price
    });
  }

  const newOrder = new Order({ 
    tableId, 
    tableNumber: table.tableNumber.toString(),
    items: enrichedItems, 
    totalAmount,
    isNewOrder: true,  // Changed from isNew
    status: "pending"
  });

  const savedOrder = await newOrder.save();

  const io = req.app.get("io");
  if (io) {
    io.emit("newOrder", savedOrder);
  }

  res.status(201).json(savedOrder);
});

// CONFIRM order
export const confirmOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.status !== "pending") {
    res.status(400);
    throw new Error("Only pending orders can be confirmed");
  }

  order.status = "confirmed";
  order.isNewOrder = false;  // Changed from isNew
  order.updatedAt = Date.now();

  const updatedOrder = await order.save();

  const io = req.app.get("io");
  if (io) {
    io.emit("orderConfirmed", updatedOrder);
  }

  res.json(updatedOrder);
});

// CANCEL order
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.status !== "pending") {
    res.status(400);
    throw new Error("Only pending orders can be cancelled");
  }

  order.status = "cancelled";
  order.isNewOrder = false;  // Changed from isNew
  order.updatedAt = Date.now();

  const updatedOrder = await order.save();

  const io = req.app.get("io");
  if (io) {
    io.emit("orderCancelled", updatedOrder);
  }

  res.json(updatedOrder);
});

// Mark order as seen
export const markOrderAsSeen = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isNewOrder = false;  // Changed from isNew
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// UPDATE order status (legacy)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  order.status = status;
  order.updatedAt = Date.now();
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// DELETE order
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  await order.deleteOne();
  res.json({ message: "Order deleted successfully" });
});