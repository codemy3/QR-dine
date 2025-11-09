import Table from "../models/Table.js";
import QRCode from "qrcode";
import asyncHandler from "express-async-handler";

// Get all tables
export const getTables = asyncHandler(async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tables", error: error.message });
  }
});

// Add new table
export const addTable = asyncHandler(async (req, res) => {
  try {
    const { tableNumber } = req.body;
    
    if (!tableNumber) {
      res.status(400);
      throw new Error("Table number is required");
    }

    // Check if table already exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      res.status(400);
      throw new Error("Table already exists");
    }

    // Create new table
    const newTable = new Table({ tableNumber });

    // Generate QR code
    const frontendURL = `${process.env.FRONTEND_URL}/order?tableId=${newTable._id}`;
    const qrCodeData = await QRCode.toDataURL(frontendURL);
    newTable.qrCode = qrCodeData;

    // Save table
    const savedTable = await newTable.save();
    res.status(201).json(savedTable);
  } catch (error) {
    res.status(400).json({ message: "Failed to add table", error: error.message });
  }
});

// Delete table
export const deleteTable = asyncHandler(async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      res.status(404);
      throw new Error("Table not found");
    }

    await table.deleteOne();
    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete table", error: error.message });
  }
});

// Update table
export const updateTable = asyncHandler(async (req, res) => {
  try {
    const { tableNumber } = req.body;
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      res.status(404);
      throw new Error("Table not found");
    }

    if (tableNumber) {
      table.tableNumber = tableNumber;
      
      // Regenerate QR code with new table number
      const frontendURL = `${process.env.FRONTEND_URL}/order?tableId=${table._id}`;
      const qrCodeData = await QRCode.toDataURL(frontendURL);
      table.qrCode = qrCodeData;
    }

    const updatedTable = await table.save();
    res.json(updatedTable);
  } catch (error) {
    res.status(400).json({ message: "Failed to update table", error: error.message });
  }
});
// Get table by table number
export const getTableByNumber = asyncHandler(async (req, res) => {
  try {
    const table = await Table.findOne({ tableNumber: req.params.tableNumber });
    
    if (!table) {
      res.status(404);
      throw new Error("Table not found");
    }
    
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch table", error: error.message });
  }
});