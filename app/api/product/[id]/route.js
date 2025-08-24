import connectToDB from "@/config/db"; // your MongoDB connection file
import Product from "@/models/Product"; // your Product mongoose model
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    // 1. Get product ID from the dynamic route
    const { id } = params;
    console.log("🟢 ID received:", id);

    // 2. Connect to MongoDB
    await connectToDB();

    // 3. Try deleting product by ID
    const deletedProduct = await Product.findByIdAndDelete(id);

    // 4. If no product found → return 404
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct, // optional → shows what was deleted
    });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error); // 👈 log full error

    // 6. Catch and return error
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
