import connectToDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { cartData } = await request.json();

    await connectToDB();
    const user = await User.findById(userId);

    user.cart = cartData;
    user.save();

    NextResponse.json({ success: true });
  } catch (error) {
    NextResponse.json({ success: false, message: error.message });
  }
}
