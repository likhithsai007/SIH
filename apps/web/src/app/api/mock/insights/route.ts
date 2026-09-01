import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    insights: [
      {
        title: "Trending Style",
        description: "Minimalist Wabi-Sabi ceramics are seeing a 45% engagement spike in your region.",
        type: "trending",
      },
      {
        title: "Optimal Posting",
        description: "Schedule your next post for Thursday at 6:00 PM to maximize visibility.",
        type: "tip",
      },
    ],
  });
}
