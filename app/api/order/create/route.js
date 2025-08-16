import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid Request" },
        { status: 400 }
      );
    }

    const productTotals = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product not found: ${item.product}`);
        return Number(product.offerPrice) * item.quantity;
      })
    );

    const amount = productTotals.reduce((sum, val) => sum + val, 0);

    await inngest.send({
      name: "order/created",
      data: {
        userId,
        items,
        address,
        amount: amount + Math.floor(amount * 0.02),
        date: new Date(),
      },
    });

    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
