import { NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q) return NextResponse.json({ results: [] });

    const results = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
