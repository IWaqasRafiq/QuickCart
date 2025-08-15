import connectToDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { cartData } = await request.json();

    await connectToDB();

    const user = await User.findOneAndUpdate(
      { _id: userId }, // ✅ match by Clerk's userId
      { $set: { cartItems: cartData } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
