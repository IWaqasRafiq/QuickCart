import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Product from "@/models/Product";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const category = formData.get("category");
    const brand = formData.get("brand");
    const model = formData.get("model");
    const color = formData.get("color");
    const size = formData.get("size");

    const files = formData.getAll("image");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const result = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
      })
    );

    const image = result.map((res) => res.secure_url);

    await connectToDB();
    const newProduct = await Product.create({
      userId,
      name,
      description,
      price: Number(price),
      offerPrice: Number(offerPrice),
      category,
      image,
      brand,
      model,
      color,
      size: Number(size),
      date: Date.now(),
    });

    return NextResponse.json(
      { success: true, message: "Upload successful", newProduct },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
