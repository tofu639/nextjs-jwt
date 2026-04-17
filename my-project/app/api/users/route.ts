import { NextRequest, NextResponse } from "next/server";
import { getPaginatedUsers } from "../../lib/mock-db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search") || "";

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: "Invalid page or limit parameter" },
      { status: 400 }
    );
  }

  const result = getPaginatedUsers(page, limit, search);

  return NextResponse.json(result);
}
