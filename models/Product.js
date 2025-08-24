import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
    index: true,
  },
  price: { type: Number, required: true },
  name: { type: String, required: true, index: true },
  description: { type: String, required: true, index: true },
  offerPrice: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  color: { type: String},
  size: { type: Number, required: true},
  model: { type: String},
  image: { type: Array, required: true },
  date: { type: Number, required: true },
});

productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  brand: "text",
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
