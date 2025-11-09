import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" }, // filename stored
  available: { type: Boolean, default: true },
}, { timestamps: true });

const MenuItem = mongoose.model("MenuItem", menuItemSchema, "menus");
export default MenuItem;
