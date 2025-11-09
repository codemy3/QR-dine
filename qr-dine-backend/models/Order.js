import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  tableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Table", 
    required: true 
  },
  tableNumber: { 
    type: String, 
    required: true 
  },
  items: [
    {
      itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "MenuItem" 
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  },
  isNewOrder: {  // Changed from isNew to isNewOrder
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  suppressReservedKeysWarning: true  // Add this to suppress the warning
});

// Update the updatedAt timestamp on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;