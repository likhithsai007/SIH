import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalArtisans: 1248,
    totalProducts: 3420,
    totalOrders: 856,
    totalRevenue: 485200,
    monthlyGrowth: 8.4,
    artisanGrowth: 12,
    productsThisMonth: 142,
    avgOrderValue: 567,
  });
}
