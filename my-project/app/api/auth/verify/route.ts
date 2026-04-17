import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "my-super-secret-key-change-in-production"
);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { valid: false, message: "No token provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: "nextjs-jwt-demo",
      audience: "nextjs-jwt-demo",
    });

    return NextResponse.json({
      valid: true,
      payload,
    });
  } catch {
    return NextResponse.json(
      { valid: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
